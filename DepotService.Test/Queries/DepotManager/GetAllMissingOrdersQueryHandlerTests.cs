using DepotService.Application.Queries.DepotManager.GetAllMissingOrders;
using DepotService.Domain.Entities;
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

namespace DepotService.Test.Queries.DepotManager
{
    public class GetAllMissingOrdersQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetAllMissingOrdersQueryHandler>> _loggerMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly GetAllMissingOrdersQueryHandler _handler;

        public GetAllMissingOrdersQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetAllMissingOrdersQueryHandler>>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());

            _handler = new GetAllMissingOrdersQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetAllMissingOrdersAsync_WhenNoMissingOrdersFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetMissingOrdersAsync())
                .ReturnsAsync(new List<DepotOrderMissing>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.GetAllMissingOrdersAsync());

            Assert.Equal("No missing orders found.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("No missing orders found.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetAllMissingOrdersAsync_WhenOrdersExist_ReturnsListOfDtos()
        {
            // Arrange
            var missingOrders = new List<DepotOrderMissing>
        {
            new DepotOrderMissing
            {
                MissingId = 1,
                DepotOrderId = 101,
                SalesOrderId = 1001,
                MissingReason = "Faltante de stock",
                MissingDescription = "No había suficiente producto",
                MissingDate = DateTime.UtcNow,
                MissingItems = new List<DepotOrderMissingItem>
                {
                    new DepotOrderMissingItem
                    {
                        DepotOrderItemId = 10,
                        ProductName = "Producto A",
                        ProductBrand = "Marca A",
                        Packaging = "Caja",
                        MissingQuantity = 2
                    }
                }
            }
        };

            _repositoryMock.Setup(r => r.GetMissingOrdersAsync())
                .ReturnsAsync(missingOrders);

            // Act
            var result = await _handler.GetAllMissingOrdersAsync();

            // Assert
            Assert.NotNull(result);
            var order = result.First();
            Assert.Equal(1, order.MissingId);
            Assert.Equal(101, order.DepotOrderId);
            Assert.Equal("Faltante de stock", order.MissingReason);
            Assert.Single(order.MissingItems);
            Assert.Equal("Producto A", order.MissingItems.First().ProductName);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("All missing orders retrieved successfully")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }

}
