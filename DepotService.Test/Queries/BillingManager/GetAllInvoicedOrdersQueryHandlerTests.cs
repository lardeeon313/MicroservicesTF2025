using DepotService.Application.Queries.BillingManager.GetAllInvoicedOrders;
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
    public class GetAllInvoicedOrdersQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetAllInvoicedOrdersQueryHandler>> _loggerMock;
        private readonly GetAllInvoicedOrdersQueryHandler _handler;

        public GetAllInvoicedOrdersQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetAllInvoicedOrdersQueryHandler>>();

            _handler = new GetAllInvoicedOrdersQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task GetAllInvoicedOrdersAsync_WhenNoOrders_ThrowsKeyNotFoundException()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetAllInvoicedOrdersAsync())
                .ReturnsAsync(new List<DepotOrderEntity>()); // lista vacía

            // Act & Assert
            var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.GetAllInvoicedOrdersAsync());

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("No invoiced orders found.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetAllInvoicedOrdersAsync_WhenOrdersExist_ReturnsList()
        {
            // Arrange
            var orders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 100,
                CustomerName = "Cliente 1",
                CustomerEmail = "cliente1@email.com",
                TotalAmount = 500m,
                Status = OrderStatus.Invoiced,
                PhoneNumber = "123456789",
                DeliveryDetail = "Dirección 1",
                OrderDate = DateTime.UtcNow,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 10,
                        ProductBrand = "MarcaA",
                        ProductName = "ProductoA",
                        PackagingType = "Caja",
                        Quantity = 2,
                        UnitPrice = 100m
                    }
                }
            }
        };

            _repositoryMock.Setup(r => r.GetAllInvoicedOrdersAsync())
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.GetAllInvoicedOrdersAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(1, result[0].DepotOrderId);
            Assert.Equal("Cliente 1", result[0].CustomerName);
            Assert.Single(result[0].Items);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Found 1 invoiced orders.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
