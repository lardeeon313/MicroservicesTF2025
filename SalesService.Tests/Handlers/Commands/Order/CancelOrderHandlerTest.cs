using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Orders.Cancel;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    /// <summary>
    /// Pruebas unitarias para CancelOrderCommandHandler
    /// </summary>
    public class CancelOrderHandlerTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock; 
        private readonly CancelOrderCommandHandler _handler;

        public CancelOrderHandlerTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _handler = new CancelOrderCommandHandler(_orderRepositoryMock.Object, _publisherMock.Object);
        }

        [Fact(DisplayName ="Deberia cancelar una orden correctamente si esta en estado Pending")]
        public async Task Handle_ShouldCancelOrder_WhenOrderIsPending()
        {
            // Arrange
            var command = new CancelOrderCommand(1, "Error de Carga");
            var order = new Order { Id = 1 , Status = OrderStatus.Pending };

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(command.Id)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(r => r.UpdateAsync(order)).Returns(Task.CompletedTask);

            // Act
            var result = await _handler.Handle(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.Canceled);

            _publisherMock.Verify(x => x.PublishAsync(
                It.IsAny<OrderCanceledIntegrationEvent>(), "order_canceled_queue"), Times.Once);
        }

        [Fact(DisplayName = "Debe lanzar excepción si la orden no existe")]
        public async Task Handle_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new CancelOrderCommand(99, "Idk");
            _orderRepositoryMock.Setup(x => x.GetByIdAsync(command.Id)).ReturnsAsync((Order)null!);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.Handle(command));
        }

        [Fact(DisplayName = "No debe cancelar si la orden ya fue emitida")]
        public async Task Handle_ShouldThrow_WhenOrderIsIssued()
        {
            // Arrange
            var command = new CancelOrderCommand(1, "Ya fue emitida");
            var order = new Order { Id = 1, Status = OrderStatus.Issued };

            // Act & Assert
            _orderRepositoryMock.Setup(x => x.GetByIdAsync(command.Id)).ReturnsAsync(order);
            await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.Handle(command));
        }
    }
}
