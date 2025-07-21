using DepotService.Application.Commands.DepotOperator.SentOrderToBilling;
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
    public class SentToBillingCommandHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<SentToBillingCommandHandler>> _loggerMock;
        private readonly SentToBillingCommandHandler _handler;

        public SentToBillingCommandHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<SentToBillingCommandHandler>>();

            _handler = new SentToBillingCommandHandler(
                _publisherMock.Object,
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task SentToBillingAsync_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            var command = new SentOrderToBillingCommand(123);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            var result = await _handler.SentToBillingAsync(command);

            // Assert
            result.Should().BeFalse();
            _loggerMock.VerifyLog(LogLevel.Error, $"Order with ID {command.DepotOrderId} not found.", Times.Once());
            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<object>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task SentToBillingAsync_ShouldReturnFalse_WhenOrderStatusIsNotInPreparation()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 123,
                Status = OrderStatus.Assigned
            };
            var command = new SentOrderToBillingCommand(order.DepotOrderId);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync(order);

            // Act
            var result = await _handler.SentToBillingAsync(command);

            // Assert
            result.Should().BeFalse();
            _loggerMock.VerifyLog(LogLevel.Error, $"Order with ID {command.DepotOrderId} is not in preparation status.", Times.Once());
            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<object>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task SentToBillingAsync_ShouldSendToBilling_WhenOrderIsValid()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 123,
                Status = OrderStatus.InPreparation,
                SalesOrderId = 789
            };
            var command = new SentOrderToBillingCommand(order.DepotOrderId);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync(order);
            _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
                .Returns(Task.CompletedTask);
            _contextMock.Setup(c => c.SaveChangesAsync(default))
                .ReturnsAsync(1);
            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderSentToBillingIntegrationEvent>(), "order_sent_billing_queue"))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.SentToBillingAsync(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.SentToBilling);

            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.Is<OrderSentToBillingIntegrationEvent>(evt =>
                evt.SalesOrderId == order.SalesOrderId &&
                evt.SentToBillingAt <= DateTime.UtcNow
            ), "order_sent_billing_queue"), Times.Once);

            _loggerMock.VerifyLog(LogLevel.Information, $"Order with ID {command.DepotOrderId} has been sent to billing successfully.", Times.Once());
            _loggerMock.VerifyLog(LogLevel.Information, $"Order with ID {command.DepotOrderId} has been published to billing queue successfully.", Times.Once());
        }
    }

    // Extension helper para verificar logs en ILogger con Moq y FluentAssertions
    public static class LoggerExtensions
    {
        public static void VerifyLog(this Mock<ILogger<SentToBillingCommandHandler>> loggerMock, LogLevel level, string message, Times times)
        {
            loggerMock.Verify(
                x => x.Log(
                    level,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(message)),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                times);
        }
    }
}
