using DepotService.Application.Queries.DepotManager.GetByIdOrder;
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
    public class GetByIdOrderQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetByIdOrderQueryHandler>> _loggerMock;
        private readonly GetByIdOrderQueryHandler _handler;

        public GetByIdOrderQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetByIdOrderQueryHandler>>();

            _handler = new GetByIdOrderQueryHandler(
                _repositoryMock.Object,
                context: null, // No es utilizado en este handler
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetByIdOrderHandler_ShouldReturnDepotOrderDto_WhenOrderExists()
        {
            // Arrange
            var depotOrderId = 1;
            var order = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                SalesOrderId = 1001,
                CustomerName = "John Doe",
                CustomerEmail = "john@example.com",
                PhoneNumber = "123456789",
                DeliveryDetail = "Some address",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.InPreparation,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 1,
                        ProductBrand = "BrandX",
                        ProductName = "ProductY",
                        PackagingType = "Box",
                        Quantity = 2,
                        UnitPrice = 50
                    }
                },
                Missings = [],
                AssignedDepotTeam = null
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId))
                .ReturnsAsync(order);

            // Act
            var result = await _handler.GetByIdOrderHandler(depotOrderId);

            // Assert
            result.Should().NotBeNull();
            result.DepotOrderId.Should().Be(depotOrderId);
            result.CustomerName.Should().Be("John Doe");
            result.Items.Should().HaveCount(1);
            result.Items.First().ProductName.Should().Be("ProductY");
            result.Items.First().Total.Should().Be(100); // 2 * 50
        }

        [Fact]
        public async Task GetByIdOrderHandler_ShouldThrowException_WhenOrderDoesNotExist()
        {
            // Arrange
            var depotOrderId = 999;
            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.GetByIdOrderHandler(depotOrderId);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage($"Order with ID {depotOrderId} not found.");
        }
    }
}
