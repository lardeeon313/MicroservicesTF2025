using FluentAssertions;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmOrderAssign;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.DeliveryOperator.LogisticOrder
{
    /// <summary>
    /// Pruebas unitarias para ConfirmAssignedOrderCommandHandler
    /// </summary>
    public class ConfirmAssignedOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly ConfirmAssignedOrderCommandHandler _handler;

        public ConfirmAssignedOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();

            // IMPORTANTE: como tu handler usa logger, mandamos un mock vacío
            var loggerMock = new Mock<Microsoft.Extensions.Logging.ILogger<ConfirmAssignedOrderCommandHandler>>();

            _handler = new ConfirmAssignedOrderCommandHandler(
                _repositoryMock.Object,
                loggerMock.Object
            );
        }

        [Fact(DisplayName = "Debe confirmar la orden cuando el operador coincide y el estado es AssignedDelivery")]
        public async Task Handle_ShouldConfirmOrder_WhenDataIsValid()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var command = new ConfirmAssignedOrderCommand(10, operatorId);

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                AssignedOperatorId = operatorId,
                Status = OrderStatus.AssignedDelivery,
                DepotOrderId = 99
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.LogisticOrderId)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>())).Returns(Task.CompletedTask);
            _repositoryMock.Setup(r => r.UpdateAsync(order)).Returns(Task.CompletedTask);

            // Act
            var result = await _handler.ConfirmAssignedOrderAsync(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.PendingDelivery);

            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Once);
        }

        [Fact(DisplayName = "Debe retornar false si la orden no existe")]
        public async Task Handle_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            var command = new ConfirmAssignedOrderCommand(10, Guid.NewGuid());
            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var result = await _handler.ConfirmAssignedOrderAsync(command);

            // Assert
            result.Should().BeFalse();
        }

        [Fact(DisplayName = "Debe retornar false si la orden pertenece a otro operador")]
        public async Task Handle_ShouldReturnFalse_WhenOperatorDoesNotMatch()
        {
            // Arrange
            var command = new ConfirmAssignedOrderCommand(10, Guid.NewGuid());

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                AssignedOperatorId = Guid.NewGuid(), // otro operador
                Status = OrderStatus.AssignedDelivery
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            // Act
            var result = await _handler.ConfirmAssignedOrderAsync(command);

            // Assert
            result.Should().BeFalse();
        }

        [Fact(DisplayName = "Debe retornar false si la orden no está en estado AssignedDelivery")]
        public async Task Handle_ShouldReturnFalse_WhenOrderIsNotAssigned()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var command = new ConfirmAssignedOrderCommand(10, operatorId);

            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                AssignedOperatorId = operatorId,
                Status = OrderStatus.PendingDelivery // estado incorrecto
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            // Act
            var result = await _handler.ConfirmAssignedOrderAsync(command);

            // Assert
            result.Should().BeFalse();
        }
    }
}
