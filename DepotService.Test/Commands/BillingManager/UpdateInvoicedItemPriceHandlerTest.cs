using DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice;
using DepotService.Domain.Entities;
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
    public class UpdateInvoicedItemPriceCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<UpdateInvoicedItemPriceCommandHandler>> _loggerMock;
        private readonly UpdateInvoicedItemPriceCommandHandler _handler;

        public UpdateInvoicedItemPriceCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<UpdateInvoicedItemPriceCommandHandler>>();

            _handler = new UpdateInvoicedItemPriceCommandHandler(
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Test que verifica que el precio del item se actualiza correctamente
        /// cuando la orden y el item existen.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldUpdateItemUnitPrice_WhenOrderAndItemExist()
        {
            // Arrange
            var orderId = 1;
            var itemId = 10;
            var newPrice = 250m;

            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Id = itemId, Quantity = 2, UnitPrice = 100 }
                }
            };

            var command = new UpdateInvoicedItemPriceCommand(orderId, itemId, newPrice, true); // O false, dependiendo de tu lógica

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.UpdateOrderAsync(order)).Returns(Task.CompletedTask);
            _contextMock.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _handler.UpdateInvoicedItemPrice(command);

            // Assert
            result.Should().BeTrue();

            var item = order.Items.First(i => i.Id == itemId);
            item.UnitPrice.Should().Be(newPrice);
            item.Total.Should().Be(newPrice * item.Quantity);

            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);
        }

        /// <summary>
        /// ❌ Test que verifica que lanza excepción si la orden no existe.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new UpdateInvoicedItemPriceCommand(99, 10, 200, true);

            _repositoryMock.Setup(r => r.GetByIdAsync(99))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            var act = async () => await _handler.UpdateInvoicedItemPrice(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Order with ID 99 not found.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// ❌ Test que verifica que lanza excepción si el item no existe dentro de la orden.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenItemNotFound()
        {
            // Arrange
            var orderId = 1;
            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Id = 5, Quantity = 3, UnitPrice = 100 } // Item diferente
                }
            };

            var command = new UpdateInvoicedItemPriceCommand(orderId, 99, 500, true); // Item 99 no existe

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(order);

            // Act
            var act = async () => await _handler.UpdateInvoicedItemPrice(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("Item with ID 99 not found in order 1.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }
    }
}
