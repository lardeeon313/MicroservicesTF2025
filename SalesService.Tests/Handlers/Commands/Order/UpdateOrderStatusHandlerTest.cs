using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Orders.UpdateStatus;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Application.IntegrationEvents.Order;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    /// <summary>
    /// Pruebas unitarias para UpdateOrderStatusHandler
    /// </summary>
    /// <param name="handler"></param>
    public class UpdateOrderStatusHandlerTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly UpdateOrderStatusCommandHandler _handler;

        public UpdateOrderStatusHandlerTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _handler = new UpdateOrderStatusCommandHandler(_orderRepositoryMock.Object, _publisherMock.Object);
        }

        [Fact(DisplayName = "Actualiza correctamente el estado y publica evento si se cambia a Issued")]
        public async Task HandleAsync_ShouldUpdateOrderStatus_WhenStatusIsIssued()
        {
            // Arrange
            var order = new Order
            {
                Id = 1,
                CustomerId = Guid.NewGuid(),
                Customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Juan",
                    LastName = "Perez",
                    Email = "juan@example.com",
                    PhoneNumber = "3515555555",
                    Address = "Calle Falsa 123"
                },
                Status = OrderStatus.Pending,
                Items = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 1,
                    ProductName = "Producto 1",
                    ProductBrand = "Marca X",
                    Quantity = 2
                }
            }
            };

            var request = new UpdateOrderStatusRequest { OrderId = 1, Status = OrderStatus.Issued };
            var command = new UpdateOrderStatusCommand(1, request);

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);
            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderIssuedIntegrationEvent>(), "order_issued_queue"))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            result.Should().BeTrue();
            _orderRepositoryMock.Verify(r => r.UpdateAsync(It.Is<Order>(o => o.Status == OrderStatus.Issued)), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderIssuedIntegrationEvent>(), "order_issued_queue"), Times.Once);
        }

        [Fact(DisplayName = "Lanza excepción si el pedido no existe")]
        public async Task HandleAsync_ShouldThrow_WhenOrderDoesNotExist()
        {
            // Arrange
            var request = new UpdateOrderStatusRequest { OrderId = 1, Status = OrderStatus.Issued };
            var command = new UpdateOrderStatusCommand(1, request);

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Order?)null);

            // Act
            var act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Order with ID 1 not found.");
        }

        [Fact(DisplayName ="Lanza excepción si intenta cambiar estado desde uno no permitido")]
        public async Task HandleAsync_ShouldThrow_WhenStatusIsNotAllowed()
        {
            // Arrange
            var order = new Order { Id = 1, Status = OrderStatus.Confirmed };

            var request = new UpdateOrderStatusRequest { OrderId = 1, Status = OrderStatus.Issued };
            var command = new UpdateOrderStatusCommand(1, request);

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Solo se puede modificar el estado si está en 'Pending'.");
        }

        [Fact(DisplayName = "Lanza excepción si intenta cambiar a un estado no válido (no Issued ni Canceled)")]
        public async Task HandleAsync_ShouldThrow_WhenTargetStatusIsInvalid()
        {
            // Arrange
            var order = new Order { Id = 1, Status = OrderStatus.Pending };

            var request = new UpdateOrderStatusRequest { OrderId = 1, Status = OrderStatus.Delivered };
            var command = new UpdateOrderStatusCommand(1, request);

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("SalesService solo puede cambiar a 'Issued' o 'Canceled'.");
        }

        [Fact(DisplayName = "No publica evento si el estado no es Issued")]
        public async Task HandleAsync_ShouldUpdateWithoutPublishing_WhenStatusIsCanceled()
        {
            // Arrange
            var order = new Order
            {
                Id = 1,
                Status = OrderStatus.Pending,
                CustomerId = Guid.NewGuid(),
                Customer = new Customer(),
                Items = new List<OrderItem>()
            };

            var request = new UpdateOrderStatusRequest { OrderId = 1, Status = OrderStatus.Canceled };
            var command = new UpdateOrderStatusCommand(1, request);

            _orderRepositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            result.Should().BeTrue();
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderIssuedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }

    }
}
