using DepotService.Application.Queries.DepotManager.GetOrdersByStatus;
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
    public class GetOrdersByStatusQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetOrdersByStatusQueryHandler>> _loggerMock;
        private readonly GetOrdersByStatusQueryHandler _handler;

        public GetOrdersByStatusQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetOrdersByStatusQueryHandler>>();

            _handler = new GetOrdersByStatusQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetOrderByStatusHandlerAsync_ShouldReturnOrders_WhenStatusIsValidAndOrdersExist()
        {
            // Arrange
            var status = "InPreparation";
            var depotOrders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 10,
                CustomerName = "Customer A",
                CustomerEmail = "a@test.com",
                PhoneNumber = "123456789",
                DeliveryDetail = "Detail A",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Received,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 1,
                        ProductBrand = "BrandA",
                        ProductName = "ProductA",
                        PackagingType = "Box",
                        Quantity = 2,
                        UnitPrice = 10m
                    }
                },
                AssignedDepotTeam = null
            }
        };

            _repositoryMock.Setup(r => r.GetOrderByStatusAsync(status))
                .ReturnsAsync(depotOrders);

            // Act
            var result = await _handler.GetOrderByStatusHandlerAsync(status);

            // Assert
            result.Should().NotBeNullOrEmpty();
            result.First().DepotOrderId.Should().Be(1);
        }

        [Fact]
        public async Task GetOrderByStatusHandlerAsync_ShouldThrowKeyNotFoundException_WhenNoOrdersFound()
        {
            // Arrange
            var status = "Prepared";
            _repositoryMock.Setup(r => r.GetOrderByStatusAsync(status))
                .ReturnsAsync(new List<DepotOrderEntity>());

            // Act
            Func<Task> act = async () => await _handler.GetOrderByStatusHandlerAsync(status);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"No orders found with status {status}");
        }

        [Fact]
        public async Task GetOrderByStatusHandlerAsync_ShouldThrowArgumentException_WhenStatusIsInvalid()
        {
            // Arrange
            var invalidStatus = "InvalidStatus";

            // Act
            Func<Task> act = async () => await _handler.GetOrderByStatusHandlerAsync(invalidStatus);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage($"Invalid order status: {invalidStatus}");
        }
    }
}
