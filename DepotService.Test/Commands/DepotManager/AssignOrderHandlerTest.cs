using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.DepotManager
{
    public class AssignOrderHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<AssignOrderCommandHandler>> _loggerMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly AssignOrderCommandHandler _handler;

        public AssignOrderHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<AssignOrderCommandHandler>>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());

            _handler = new AssignOrderCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task HandleAsync_ShouldAssignOrder_WhenOrderExists()
        {
            // Arrange
            var command = new AssignOrderCommand(1, Guid.NewGuid());
            var order = new DepotOrderEntity
            {
                DepotOrderId = command.DepotOrderId,
                SalesOrderId = 100,
                Status = OrderStatus.Received
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync(order);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderConfirmedIntegrationEvent>(), "order_confirmed_queue"))
                .Returns(Task.CompletedTask);

            // Act
            await _handler.HandleAsync(command);

            // Assert
            order.AssignedOperatorId.Should().Be(command.OperatorUserId);
            order.Status.Should().Be(OrderStatus.Assigned);

            _repositoryMock.Verify(r => r.GetByIdAsync(command.DepotOrderId), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(
                It.Is<OrderConfirmedIntegrationEvent>(e =>
                    e.DepotOrderId == command.DepotOrderId &&
                    e.SalesOrderId == order.SalesOrderId
                ), "order_confirmed_queue"
            ), Times.Once);
        }

        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new AssignOrderCommand(99, Guid.NewGuid());

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {command.DepotOrderId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.DepotOrderId), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderConfirmedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }
    }
}
