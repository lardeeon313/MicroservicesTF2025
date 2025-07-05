using DepotService.Application.Queries.DepotManager.GetAllOrders;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotManager
{
    public class GetAllOrdersQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetAllOrdersQueryHandler>> _loggerMock;
        private readonly GetAllOrdersQueryHandler _handler;

        public GetAllOrdersQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetAllOrdersQueryHandler>>();
            _handler = new GetAllOrdersQueryHandler(
                context: null, // No es necesario para este handler
                repository: _repositoryMock.Object,
                logger: _loggerMock.Object
            );
        }

        [Fact]
        public async Task AllOrdersHandleAsync_ShouldReturnListOfOrders_WhenOrdersExist()
        {
            // Arrange
            var orders = new List<DepotOrderEntity>
            {
                new DepotOrderEntity
                {
                    DepotOrderId = 1,
                    SalesOrderId = 1001,
                    CustomerName = "Juan Pérez",
                    CustomerEmail = "juan@example.com",
                    PhoneNumber = "12345678",
                    TotalAmount = 500,
                    DeliveryDetail = "Dirección X",
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.InPreparation,
                    Items = new List<DepotOrderItemEntity>
                    {
                        new DepotOrderItemEntity
                        {
                            Id = 1,
                            ProductName = "Producto A",
                            ProductBrand = "Marca A",
                            PackagingType = "Caja",
                            Quantity = 2,
                            UnitPrice = 100
                        }
                    }
                }
            };

            _repositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.AllOrdersHandleAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result.First().DepotOrderId.Should().Be(1);
            result.First().Items.Should().HaveCount(1);

            _loggerMock.VerifyLog(LogLevel.Information, Times.Once());
        }

        [Fact]
        public async Task AllOrdersHandleAsync_ShouldThrowKeyNotFoundException_WhenNoOrdersFound()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<DepotOrderEntity>());

            // Act
            var act = async () => await _handler.AllOrdersHandleAsync();

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("No orders found in the depot.");

            _loggerMock.VerifyLog(LogLevel.Warning, Times.Once());
        }
    }

    // ✔️ Extension para verificar logs con Moq
    public static class LoggerExtensions
    {
        public static void VerifyLog<T>(this Mock<ILogger<T>> logger, LogLevel level, Times times)
        {
            logger.Verify(
                x => x.Log(
                    level,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => true),
                    It.IsAny<Exception>(),
                    It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
                times);
        }
    }
}
