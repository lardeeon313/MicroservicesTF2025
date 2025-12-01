using FluentAssertions;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.LogisticOrder
{
    public class SetPriorityOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<SetDeliveryPriorityOrderCommandHandler>> _loggerMock;
        private readonly SetDeliveryPriorityOrderCommandHandler _handler;

        public SetPriorityOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _loggerMock = new Mock<ILogger<SetDeliveryPriorityOrderCommandHandler>>();

            _handler = new SetDeliveryPriorityOrderCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact(DisplayName = "Debe retornar true cuando la orden existe")]
        public async Task SetPriorityHandleAsync_ShouldReturnTrue_WhenOrderExists()
        {
            // Arrange
            var orderId = 20;
            var priority = DeliveryPriority.High;

            var command = new SetDeliveryPriorityOrderCommand(orderId, priority);

            var fakeOrder = new Domain.Entities.LogisticOrder();

            _repositoryMock
                .Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(fakeOrder);

            _repositoryMock
                .Setup(r => r.UpdateAsync(fakeOrder))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.SetPriorityHandleAsync(command);

            // Assert
            result.Should().BeTrue();

            fakeOrder.DeliveryPriority.Should().Be(priority);

            _repositoryMock.Verify(r => r.GetByIdAsync(orderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(fakeOrder), Times.Once);

            // Verificar que logueó la actualización
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) =>
                        v.ToString()!.Contains("updated to priority")),
                    It.IsAny<Exception?>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once
            );
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden no existe")]
        public async Task SetPriorityHandleAsync_ShouldReturnFalse_WhenOrderDoesNotExist()
        {
            // Arrange
            var orderId = 999;
            var priority = DeliveryPriority.Low;

            var command = new SetDeliveryPriorityOrderCommand(orderId, priority);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var result = await _handler.SetPriorityHandleAsync(command);

            // Assert
            result.Should().BeFalse();

            _repositoryMock.Verify(r => r.GetByIdAsync(orderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);

            // Verificar log de advertencia
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) =>
                        v.ToString()!.Contains("not found")),
                    It.IsAny<Exception?>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once
            );
        }
    }
}
