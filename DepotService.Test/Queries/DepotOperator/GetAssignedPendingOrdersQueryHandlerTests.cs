using DepotService.Application.Queries.Operator.GetAssignedPendingOrders;
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
    public class GetAssignedPendingOrdersQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetAssignedPendingOrdersQueryHandler>> _loggerMock;
        private readonly DepotDbContext _context; // Si no usas, puedes pasar null
        private readonly GetAssignedPendingOrdersQueryHandler _handler;

        public GetAssignedPendingOrdersQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetAssignedPendingOrdersQueryHandler>>();
            _context = null; // O mock si es necesario
            _handler = new GetAssignedPendingOrdersQueryHandler(_repositoryMock.Object, _context, _loggerMock.Object);
        }

        [Fact]
        public async Task GetAssignedPendingOrders_ShouldReturnOrders_WhenOrdersExist()
        {
            // Arrange
            var orders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 10,
                SalesOrderId = 100,
                Status = Domain.Enums.OrderStatus.Assigned,
                CustomerName = "Cliente 1",
                CustomerEmail = "cliente1@email.com",
                PhoneNumber = "123456789",
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
                },
                AssignedDepotTeam = null
            }
        };

            _repositoryMock.Setup(r => r.GetAssignedPendingOrdersByOperatorIdAsync())
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.GetAssignedPendingOrders();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].DepotOrderId.Should().Be(10);
            result[0].Items.Should().HaveCount(1);
        }

        [Fact]
        public async Task GetAssignedPendingOrders_ShouldThrowKeyNotFoundException_WhenNoOrders()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetAssignedPendingOrdersByOperatorIdAsync())
                .ReturnsAsync((List<DepotOrderEntity>)null);

            // Act
            Func<Task> act = async () => await _handler.GetAssignedPendingOrders();

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>();
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("No pending orders found")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }
    }
}
