using DepotService.Application.Queries.BillingManager.GetInvoicedOrderById;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.BillingManager
{
    public class GetInvoicedOrderByIdQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<GetInvoicedOrderByIdQueryHandler>> _loggerMock;
        private readonly GetInvoicedOrderByIdQueryHandler _handler;

        public GetInvoicedOrderByIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<GetInvoicedOrderByIdQueryHandler>>();

            _handler = new GetInvoicedOrderByIdQueryHandler(
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetInvoicedOrderByIdAsync_WhenOrderDoesNotExist_ThrowsKeyNotFoundException()
        {
            // Arrange
            var query = new GetInvoicedOrderByIdQuery(1);
            _repositoryMock.Setup(r => r.GetByIdAsync(query.BillingOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.GetInvoicedOrderByIdAsync(query));

            Assert.Equal("Invoiced order with ID 1 not found.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, _) => o.ToString()!.Contains("Invoiced order with ID 1 not found.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetInvoicedOrderByIdAsync_WhenOrderExists_ReturnsDepotOrderDto()
        {
            // Arrange
            var query = new GetInvoicedOrderByIdQuery(1);

            var order = new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 100,
                CustomerName = "Cliente Ejemplo",
                CustomerEmail = "cliente@email.com",
                PhoneNumber = "123456789",
                TotalAmount = 1500m,
                DeliveryDetail = "Calle Falsa 123",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
            {
                new DepotOrderItemEntity
                {
                    Id = 10,
                    ProductBrand = "MarcaA",
                    ProductName = "ProductoA",
                    PackagingType = "Caja",
                    Quantity = 3,
                    UnitPrice = 500m
                }
            }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(query.BillingOrderId))
                .ReturnsAsync(order);

            // Act
            var result = await _handler.GetInvoicedOrderByIdAsync(query);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(order.DepotOrderId, result.DepotOrderId);
            Assert.Equal(order.SalesOrderId, result.SalesOrderId);
            Assert.Equal(order.CustomerName, result.CustomerName);
            Assert.Equal(order.TotalAmount, result.TotalAmount);
            Assert.Equal(order.Status, result.Status);
            Assert.Single(result.Items);
            Assert.Equal(1500m, result.Items.First().Total);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, _) => o.ToString()!.Contains("Retrieved invoiced order with ID 1.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
