using DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder;
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
    public class GetBillingDetailsByOrderIdQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetBillingDetailsByOrderIdQueryHandler>> _loggerMock;
        private readonly GetBillingDetailsByOrderIdQueryHandler _handler;

        public GetBillingDetailsByOrderIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetBillingDetailsByOrderIdQueryHandler>>();

            _handler = new GetBillingDetailsByOrderIdQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task GetBillingDetailsByOrderIdAsync_WhenOrderDoesNotExist_ThrowsKeyNotFoundException()
        {
            // Arrange
            var query = new GetBillingDetailsByOrderIdQuery(1);
            _repositoryMock.Setup(r => r.GetByIdAsync(query.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.GetBillingDetailsByOrderIdAsync(query));

            Assert.Equal("Order with ID 1 not found.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString()!.Contains("Order with ID 1 not found.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetBillingDetailsByOrderIdAsync_WhenOrderExists_ReturnsDepotOrderDto()
        {
            // Arrange
            var query = new GetBillingDetailsByOrderIdQuery(1);

            var order = new Domain.Entities.DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 100,
                CustomerName = "Cliente 1",
                CustomerEmail = "cliente1@email.com",
                PhoneNumber = "123456789",
                TotalAmount = 1000m,
                DeliveryDetail = "Dirección 123",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
            {
                new DepotOrderItemEntity
                {
                    Id = 10,
                    ProductName = "Producto A",
                    ProductBrand = "Marca A",
                    PackagingType = "Caja",
                    Quantity = 2,
                    UnitPrice = 500m
                }
            }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(query.DepotOrderId))
                .ReturnsAsync(order);

            // Act
            var result = await _handler.GetBillingDetailsByOrderIdAsync(query);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(order.DepotOrderId, result.DepotOrderId);
            Assert.Equal(order.SalesOrderId, result.SalesOrderId);
            Assert.Equal(order.CustomerName, result.CustomerName);
            Assert.Equal(order.TotalAmount, result.TotalAmount);
            Assert.Equal(order.Status, result.Status);
            Assert.Single(result.Items);
            Assert.Equal(1000m, result.Items.First().Total);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString()!.Contains("Retrieved billing details for order ID 1.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
