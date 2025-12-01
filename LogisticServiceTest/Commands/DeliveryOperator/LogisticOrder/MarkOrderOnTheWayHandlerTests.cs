using Castle.Core.Logging;
using FluentAssertions;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.DeliveryOperator.LogisticOrder
{
    public class MarkOrderOnTheWayHandlerTests
    {
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly MarkOrderOnTheWayCommandHandler _handler;
        private readonly Mock<ILogger<MarkOrderOnTheWayCommandHandler>> _loggerMock;

        public MarkOrderOnTheWayHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<MarkOrderOnTheWayCommandHandler>>(); 

            _handler = new MarkOrderOnTheWayCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        private Domain.Entities.LogisticOrder CreateFakeOrder(OrderStatus status)
        {
            return new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 10,
                SalesOrderId = 20,
                Status = status,
                PaymentType = PaymentType.Cash
            };
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden no es encontrada")]
        public async Task MarkOrderOnTheWay_ShouldReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                           .ReturnsAsync((Domain.Entities.LogisticOrder)null!);

            var command = new MarkOrderOnTheWayCommand(1, Guid.NewGuid());

            // Act
            var result = await _handler.MarkOrderOnTheWayAsync(command);

            // Assert
            result.Should().BeFalse();
            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        }

        [Fact(DisplayName = "Debe retornar false cuando la orden no está en estado PendingDelivery")]
        public async Task MarkOrderOnTheWay_ShouldReturnFalse_WhenOrderIsNotPendingDelivery()
        {
            // Arrange
            var fakeOrder = CreateFakeOrder(OrderStatus.AssignedDelivery);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(fakeOrder);

            var command = new MarkOrderOnTheWayCommand(1, Guid.NewGuid());

            // Act
            var result = await _handler.MarkOrderOnTheWayAsync(command);

            // Assert
            result.Should().BeFalse();
            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.LogisticOrder>()), Times.Never);
        }

        [Fact(DisplayName = "Debe actualizar el estado a OnTheWay cuando la orden está en estado PendingDelivery")]
        public async Task MarkOrderOnTheWay_ShouldUpdateStatus_WhenOrderIsPendingDelivery()
        {
            // Arrange
            var fakeOrder = CreateFakeOrder(OrderStatus.PendingDelivery);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(fakeOrder);

            var command = new MarkOrderOnTheWayCommand(1, Guid.NewGuid());

            // Act
            var result = await _handler.MarkOrderOnTheWayAsync(command);

            // Assert
            result.Should().BeTrue();

            fakeOrder.Status.Should().Be(OrderStatus.OnTheWay);

            _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
            _repositoryMock.Verify(r => r.AddStatusHistoryAsync(It.IsAny<OrderStatusHistory>()), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(fakeOrder), Times.Once);            
        }
    }
}
