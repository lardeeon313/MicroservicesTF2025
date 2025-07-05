using DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling;
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
    public class GetOrdersPendingBillingQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<GetOrdersPendingBillingQueryHandler>> _loggerMock;
        private readonly GetOrdersPendingBillingQueryHandler _handler;

        public GetOrdersPendingBillingQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<GetOrdersPendingBillingQueryHandler>>();

            _handler = new GetOrdersPendingBillingQueryHandler(
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task HandleAsync_WhenNoOrdersFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetOrdersPendingBillingAsync())
                .ReturnsAsync(new List<DepotOrderEntity>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.HandleAsync());

            Assert.Equal("No pending billing orders found.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("No pending billing orders found.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task HandleAsync_WhenOrdersExist_ReturnsDepotOrderDtoList()
        {
            // Arrange
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
                Status = OrderStatus.SentToBilling,
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
            }
        };

            _repositoryMock.Setup(r => r.GetOrdersPendingBillingAsync())
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.HandleAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            var order = result.First();
            Assert.Equal(1, order.DepotOrderId);
            Assert.Equal(250, order.TotalAmount);
            Assert.Single(order.Items);
            Assert.Equal(200, order.Items.First().Total);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("Found 1 pending billing orders.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }

}
