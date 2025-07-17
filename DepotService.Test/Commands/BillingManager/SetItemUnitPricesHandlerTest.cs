using DepotService.Application.Commands.BillingManager.SetItemUnitPrices;
using DepotService.Application.DTOs.BillingManager;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.BillingManager
{
    public class SetItemUnitPricesCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<SetItemUnitPricesCommandHandler>> _loggerMock;
        private readonly SetItemUnitPricesCommandHandler _handler;

        public SetItemUnitPricesCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<SetItemUnitPricesCommandHandler>>();

            _handler = new SetItemUnitPricesCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Test que verifica que los precios unitarios se actualizan correctamente
        /// cuando el pedido existe y está en estado SentToBilling.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldSetItemUnitPrices_WhenOrderIsValid()
        {
            // Arrange
            var orderId = 1;
            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                Status = OrderStatus.SentToBilling,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Id = 10, Quantity = 2, UnitPrice = null },
                    new() { Id = 20, Quantity = 3, UnitPrice = null }
                }
            };

            var command = new SetItemUnitPricesCommand(orderId, new List<ItemUnitPriceDto>
            {
                new(10, 100), // Item 1 precio 100
                new(20, 200)  // Item 2 precio 200
            });

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.UpdateOrderAsync(order)).Returns(Task.CompletedTask);
            _contextMock.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _handler.SetItemUnitPriceHandlerAsync(command);

            // Assert
            result.Should().BeTrue();

            order.Items.First(i => i.Id == 10).UnitPrice.Should().Be(100);
            order.Items.First(i => i.Id == 20).UnitPrice.Should().Be(200);
            order.TotalAmount.Should().Be(100 * 2 + 200 * 3);

            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);
        }

        /// <summary>
        /// ❌ Test que verifica que lanza excepción si el pedido no existe.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var orderId = 99;
            var command = new SetItemUnitPricesCommand(orderId, []);

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync((DepotOrderEntity?)null);

            // Act
            var act = async () => await _handler.SetItemUnitPriceHandlerAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {orderId} not found.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// ❌ Test que verifica que lanza excepción si el pedido no está en estado SentToBilling.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenOrderStatusIsInvalid()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 1,
                Status = OrderStatus.PendingResolution, // Estado inválido
                Items = []
            };

            var command = new SetItemUnitPricesCommand(1, []);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var act = async () => await _handler.SetItemUnitPriceHandlerAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Order with ID 1 is not in the correct status to set item unit prices.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// ❌ Test que verifica que lanza excepción si algún item no existe en el pedido.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenItemNotFoundInOrder()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 1,
                Status = OrderStatus.SentToBilling,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Id = 10, Quantity = 2, UnitPrice = null }
                }
            };

            var command = new SetItemUnitPricesCommand(1, new List<ItemUnitPriceDto>
            {
                new(99, 500) // Item no existente
            });

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var act = async () => await _handler.SetItemUnitPriceHandlerAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Item with ID 99 not found in order 1.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }
    }
}
