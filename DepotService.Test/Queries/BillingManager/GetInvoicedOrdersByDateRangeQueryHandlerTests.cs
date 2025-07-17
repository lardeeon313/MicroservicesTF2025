using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange;
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
    public class GetInvoicedOrdersByDateRangeQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<GetInvoicedOrdersByDateRangeQueryHandler>> _loggerMock;
        private readonly GetInvoicedOrdersByDateRangeQueryHandler _handler;

        public GetInvoicedOrdersByDateRangeQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<GetInvoicedOrdersByDateRangeQueryHandler>>();

            _handler = new GetInvoicedOrdersByDateRangeQueryHandler(
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetInvoicedOrdersByDateRangeAsync_WhenNoOrdersFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var query = new GetInvoicedOrdersByDateRangeQuery(DateTime.UtcNow.AddDays(-10), DateTime.UtcNow);

            _repositoryMock.Setup(r => r.GetInvoicedOrdersByDateRangeAsync(query.StartDate, query.EndDate))
                .ReturnsAsync(new List<DepotOrderEntity>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.GetInvoicedOrdersByDateRangeAsync(query));

            Assert.Equal("No invoiced orders found for the specified date range.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("No invoiced orders found for the specified date range.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetInvoicedOrdersByDateRangeAsync_WhenOrdersExist_ReturnsDepotOrderDtoList()
        {
            // Arrange
            var query = new GetInvoicedOrdersByDateRangeQuery(DateTime.UtcNow.AddDays(-10), DateTime.UtcNow);

            var orders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 101,
                CustomerName = "Cliente A",
                CustomerEmail = "clientea@mail.com",
                PhoneNumber = "123456",
                TotalAmount = 250,
                DeliveryDetail = "Dirección A",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 1,
                        ProductBrand = "Marca1",
                        ProductName = "Producto1",
                        PackagingType = "Caja",
                        Quantity = 2,
                        UnitPrice = 100
                    }
                }
            },
            new DepotOrderEntity
            {
                DepotOrderId = 2,
                SalesOrderId = 102,
                CustomerName = "Cliente B",
                CustomerEmail = "clienteb@mail.com",
                PhoneNumber = "654321",
                TotalAmount = 500,
                DeliveryDetail = "Dirección B",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 2,
                        ProductBrand = "Marca2",
                        ProductName = "Producto2",
                        PackagingType = "Bolsa",
                        Quantity = 5,
                        UnitPrice = 100
                    }
                }
            }
        };

            _repositoryMock.Setup(r => r.GetInvoicedOrdersByDateRangeAsync(query.StartDate, query.EndDate))
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.GetInvoicedOrdersByDateRangeAsync(query);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            Assert.Collection(result,
                order =>
                {
                    Assert.Equal(1, order.DepotOrderId);
                    Assert.Equal(250, order.TotalAmount);
                    Assert.Single(order.Items);
                    Assert.Equal(200, order.Items.First().Total);
                },
                order =>
                {
                    Assert.Equal(2, order.DepotOrderId);
                    Assert.Equal(500, order.TotalAmount);
                    Assert.Single(order.Items);
                    Assert.Equal(500, order.Items.First().Total);
                });

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains($"Found 2 invoiced orders in the date range")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }

}
