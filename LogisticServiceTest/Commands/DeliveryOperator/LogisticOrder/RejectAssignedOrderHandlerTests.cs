using FluentAssertions;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident;
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
    public class RejectAssignedOrderHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly RejectAssignedOrderCommandHandler _handler;
        private readonly Mock<ILogger<RejectAssignedOrderCommandHandler>> _loggerMock;

        public RejectAssignedOrderHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _loggerMock = new Mock<ILogger<RejectAssignedOrderCommandHandler>>();

            _handler = new RejectAssignedOrderCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        private Domain.Entities.LogisticOrder CreateFakeOrder(OrderStatus status, Guid operatorId)
        {
            return new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 100,
                SalesOrderId = 200,
                Status = status,
                AssignedOperatorId = operatorId
            };
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden no es encontrada")]
        public async Task RejectAssignedOrder_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                           .ReturnsAsync((Domain.Entities.LogisticOrder)null!);

            var cmd = new RejectAssignedOrderCommand(1, Guid.NewGuid(), "No puedo tomarlo");

            // Act
            var result = await _handler.RejectAssignedOrderAsync(cmd);

            // Assert
            result.Should().BeFalse();
            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden está asignada a otro operador")]
        public async Task RejectAssignedOrder_ShouldReturnFalse_WhenOrderAssignedToAnotherOperator()
        {
            // Arrange
            var correctOperator = Guid.NewGuid();
            var anotherOperator = Guid.NewGuid();

            var fakeOrder = CreateFakeOrder(OrderStatus.AssignedDelivery, correctOperator);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(fakeOrder);

            var cmd = new RejectAssignedOrderCommand(1, anotherOperator, "No me corresponde");

            // Act
            var result = await _handler.RejectAssignedOrderAsync(cmd);

            // Assert
            result.Should().BeFalse();
            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);
            _repositoryMock.Verify(r => r.AddDeliveryRejectionAsync(It.IsAny<DeliveryRejectionReason>()), Times.Never);
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden no está en estado AssignedDelivery")]
        public async Task RejectAssignedOrder_ShouldReturnFalse_WhenOrderIsNotInAssignedDeliveryState()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var fakeOrder = CreateFakeOrder(OrderStatus.PendingDelivery, operatorId);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(fakeOrder);

            var cmd = new RejectAssignedOrderCommand(1, operatorId, "Motivo cualquiera");

            // Act
            var result = await _handler.RejectAssignedOrderAsync(cmd);

            // Assert
            result.Should().BeFalse();
            fakeOrder.Status.Should().Be(OrderStatus.PendingDelivery);

            _repositoryMock.Verify(r => r.AddDeliveryRejectionAsync(It.IsAny<DeliveryRejectionReason>()), Times.Never);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Never);
        }

        [Fact(DisplayName = "Debe actualizar el estado y registrar el rechazo cuando los datos son válidos")]
        public async Task RejectAssignedOrder_ShouldUpdateStatusAndRegisterRejection_WhenValid()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var fakeOrder = CreateFakeOrder(OrderStatus.AssignedDelivery, operatorId);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(fakeOrder);

            var cmd = new RejectAssignedOrderCommand(1, operatorId, "No puedo entregarlo");

            // Act
            var result = await _handler.RejectAssignedOrderAsync(cmd);

            // Assert
            result.Should().BeTrue();

            fakeOrder.Status.Should().Be(OrderStatus.AssignmentCancelled);

            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
            _repositoryMock.Verify(r => r.AddDeliveryRejectionAsync(It.IsAny<DeliveryRejectionReason>()), Times.Once);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(fakeOrder), Times.Once);
        }
    }
}
