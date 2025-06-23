using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Orders.Register;
using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.Entities.OrderEntity;
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
    /// Pruebas unitarias para RegisterOrderCommandHandler.
    /// </summary>
    public class RegisterOrderHandlerTest
    {
        private readonly Mock<IOrderRepository> _orderRepo = new();
        private readonly Mock<ICustomerRepository> _customerRepo = new();
        private readonly Mock<IRabbitMQPublisher> _publisher = new();
        private readonly RegisterOrderCommandHandler _handler;

        public RegisterOrderHandlerTest()
        {
            _handler = new RegisterOrderCommandHandler(_orderRepo.Object, _publisher.Object, _customerRepo.Object);
        }

        [Fact(DisplayName = "Debe registrar una orden y publicar evento")]
        public async Task HandleAsync_ShouldRegisterOrder_AndPublishEvent()
        {
            // Arrange
            var command = new RegisterOrderCommand(
                Guid.NewGuid(),
                new List<RegisterOrderItemRequest> {
                    new() { ProductName = "Agua", ProductBrand = "Eco", Quantity = 2 }
                },
                null,
                "Entrega mañana",
                "User123"
            );

            // Act
            var customer = new Customer { Id = command.CustomerId };

            _customerRepo.Setup(c => c.GetByIdAsync(command.CustomerId)).ReturnsAsync(customer);
            _orderRepo.Setup(o => o.AddAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);

            // Result
            var result = await _handler.HandleAsync(command);

            result.Should().NotBeNull();
            result.CustomerId.Should().Be(command.CustomerId);

            // Assert
            _publisher.Verify(p => p.PublishAsync(
                It.IsAny<OrderRegisteredIntegrationEvent>(), "order_registered_queue"), Times.Once);
        }

        [Fact(DisplayName = "Debe lanzar excepción si el cliente no existe")]
        public async Task HandleAsync_ShouldThrow_WhenCustomerNotFound()
        {
            // Arrange
            var command = new RegisterOrderCommand(Guid.NewGuid(), [], null, "Sin dirección", "user123");

            // Act
            _customerRepo.Setup(c => c.GetByIdAsync(command.CustomerId)).ReturnsAsync((Customer)null!);

            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.HandleAsync(command));
        }
    }
}
