using DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder;
using DepotService.Domain.Common.Interfaces;
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

namespace DepotService.Test.Commands.DepotOperator
{
    public class ConfirmAssignedOrderCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<ConfirmAssignedOrderCommandHandler>> _loggerMock;
        private readonly ConfirmAssignedOrderCommandHandler _handler;
        private readonly Mock<IEmailService> _emailServiceMock;

        public ConfirmAssignedOrderCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<ConfirmAssignedOrderCommandHandler>>();
            _emailServiceMock = new Mock<IEmailService>();

            _handler = new ConfirmAssignedOrderCommandHandler(
                _emailServiceMock.Object,
                _publisherMock.Object,
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Verifica que la orden se confirma correctamente cuando existe y está asignada al operador.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldConfirmOrder_WhenOrderExistsAndAssignedToOperator()
        {
            // Arrange
            var orderId = 1;
            var operatorId = Guid.NewGuid();
            var salesOrderId = 500;

            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                AssignedOperatorId = operatorId,
                SalesOrderId = salesOrderId,
                Status = OrderStatus.Assigned
            };

            var command = new ConfirmAssignedOrderCommand(orderId, operatorId);

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(order);

            _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(default))
                .ReturnsAsync(1);

            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), "order_in_preparation_queue"))
                .Returns(Task.CompletedTask);

            // Act
            await _handler.HandleAsync(command);

            // Assert
            order.Status.Should().Be(OrderStatus.InPreparation);

            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), "order_in_preparation_queue"), Times.Once);
        }

        /// <summary>
        /// ❌ Verifica que lanza excepción si la orden no existe.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new ConfirmAssignedOrderCommand(1, Guid.NewGuid());

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            var act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {command.DepotOrderId} not found.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }

        /// <summary>
        /// ❌ Verifica que lanza excepción si el operador no es el asignado a la orden.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenOperatorIsNotAssigned()
        {
            // Arrange
            var orderId = 1;
            var correctOperatorId = Guid.NewGuid();
            var wrongOperatorId = Guid.NewGuid();

            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                AssignedOperatorId = correctOperatorId,
                Status = OrderStatus.Assigned
            };

            var command = new ConfirmAssignedOrderCommand(orderId, wrongOperatorId);

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(order);

            // Act
            var act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {orderId} is not assigned to operator {wrongOperatorId}.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }
    }
}
