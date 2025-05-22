using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Orders.Update;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers;

    /// <summary>
    /// Pruebas unitarias para el comando de actualización de orden
    /// </summary>
    /// <param name="handler"></param>
    public class UpdateOrderTest
    {
        private readonly UpdateOrderCommandHandler _handler;
        private readonly Mock<IOrderRepository> _repositoryMock;

    public UpdateOrderTest()
    {
        _repositoryMock = new Mock<IOrderRepository>();
        _handler = new UpdateOrderCommandHandler(_repositoryMock.Object);
    }



    [Fact(DisplayName = "Debe actualizar orden correctamente")]
        public async Task HandleAsync_ShouldUpdateOrderCorrectly()
        {
            var existingOrder = new Order
            {
                Id = 1,
                CustomerId = Guid.NewGuid(),
                Items = new List<OrderItem>()
            };

            var request = new UpdateOrderRequest
            {
                OrderId = 1,
                DeliveryDetail = "Calle nueva",
                Status = OrderStatus.Confirmed,
                Items = new List<UpdateOrderItemRequest>
            {
                new() { Id = 0, ProductName = "Detergente", ProductBrand = "Magistral", Quantity = 1 }
            }
            };

            var command = new UpdateOrderCommand(1, request);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingOrder);
            _repositoryMock.Setup(r => r.UpdateAsync(existingOrder)).Returns(Task.CompletedTask);

            var result = await _handler.HandleAsync(command);

            result.Should().NotBeNull();
            result.Status.Should().Be(OrderStatus.Confirmed);
            result.Items.Should().HaveCount(1);
        }

        [Fact(DisplayName = "Debe lanzar excepción si la orden no existe")]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            var command = new UpdateOrderCommand(10, new UpdateOrderRequest());

            _repositoryMock.Setup(r => r.GetByIdAsync(command.OrderId)).ReturnsAsync((Order)null!);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.HandleAsync(command));
        }
    }


