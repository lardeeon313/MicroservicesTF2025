using DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotOperator
{
    public class GetOrdersByOperatorQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetOrdersByOperatorQueryHandler>> _loggerMock;
        private readonly GetOrdersByOperatorQueryHandler _handler;

        public GetOrdersByOperatorQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetOrdersByOperatorQueryHandler>>();

            _handler = new GetOrdersByOperatorQueryHandler(_repositoryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task GetOrdersByOperatorAsync_ShouldReturnOrders_WhenOrdersExist()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var orders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 100,
                CustomerName = "Cliente 1",
                CustomerEmail = "cliente1@test.com",
                PhoneNumber = "123456789",
                Status = Domain.Enums.OrderStatus.InPreparation,
                DeliveryDetail = "Dirección 1",
                OrderDate = DateTime.UtcNow.AddDays(-1),
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 1,
                        ProductBrand = "Marca A",
                        ProductName = "Producto A",
                        PackagingType = "Caja",
                        Quantity = 2
                    }
                }
            }
        };

            _repositoryMock.Setup(r => r.GetAllByOperatorIdAsync(operatorId))
                .ReturnsAsync(orders);

            var query = new GetOrdersByOperatorQuery { OperatorUserId = operatorId };

            // Act
            var result = await _handler.GetOrdersByOperatorAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result.First().DepotOrderId.Should().Be(1);
            result.First().Items.Should().HaveCount(1);
            result.First().Items.First().ProductName.Should().Be("Producto A");
        }

        [Fact]
        public async Task GetOrdersByOperatorAsync_ShouldReturnEmpty_WhenNoOrdersExist()
        {
            // Arrange
            var operatorId = Guid.NewGuid();

            _repositoryMock.Setup(r => r.GetAllByOperatorIdAsync(operatorId))
                .ReturnsAsync(new List<DepotOrderEntity>());

            var query = new GetOrdersByOperatorQuery { OperatorUserId = operatorId };

            // Act
            var result = await _handler.GetOrdersByOperatorAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }
    }
}
