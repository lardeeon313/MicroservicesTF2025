using FluentAssertions;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder;
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
    public class RemoveAssignOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<RemoveAssignOrderCommandHandler>> _loggerMock;
        private readonly RemoveAssignOrderCommandHandler _handler;

        public RemoveAssignOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _loggerMock = new Mock<ILogger<RemoveAssignOrderCommandHandler>>();

            _handler = new RemoveAssignOrderCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact(DisplayName = "Debe desasignar la orden correctamente cuando existe")]
        public async Task RemoveAssignOrder_ShouldReturnTrue_WhenOrderExists()
        {
            // Arrange
            var orderId = 10;
            var userId = Guid.NewGuid();
            var command = new RemoveAssignOrderCommand(orderId, userId);

            // Crear orden real correctamente preparada
            var fakeOrder = new Domain.Entities.LogisticOrder(10, 20)
            {
                Status = OrderStatus.AssignedDelivery,
                AssignedOperatorId = Guid.NewGuid(),
                AssignedDeliveryTeamId = 5,
                AssignedDeliveryZoneId = 3
            };

            _repositoryMock
                .Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(fakeOrder);

            _repositoryMock
                .Setup(r => r.UpdateAsync(fakeOrder))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.RemoveAssignOrder(command);

            // Assert
            result.Should().BeTrue();

            _repositoryMock.Verify(r => r.GetByIdAsync(orderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(fakeOrder), Times.Once);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("desasignada")),
                    It.IsAny<Exception?>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ),
                Times.Once
            );
        }

        [Fact(DisplayName = "Debe lanzar excepción cuando la orden no existe")]
        public async Task RemoveAssignOrder_ShouldThrow_WhenOrderDoesNotExist()
        {
            // Arrange
            var orderId = 999;
            var userId = Guid.NewGuid();

            var command = new RemoveAssignOrderCommand(orderId, userId);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var action = async () => await _handler.RemoveAssignOrder(command);

            // Assert
            await action.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {orderId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(orderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);
        }
    }
}
