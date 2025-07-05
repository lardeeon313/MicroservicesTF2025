using DepotService.Application.Queries.Operator.GetOrderById;
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
    public class GetOrderByIdQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetOrderByIdQueryHandler>> _loggerMock;
        private readonly DepotDbContext _context; // Puedes pasar null o mock si no se usa
        private readonly GetOrderByIdQueryHandler _handler;

        public GetOrderByIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetOrderByIdQueryHandler>>();
            _context = null;
            _handler = new GetOrderByIdQueryHandler(_context, _repositoryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task GetOrderByIdHandler_ShouldReturnOrderDto_WhenOrderExistsAndAssignedToOperator()
        {
            // Arrange
            var depotOrderId = 123;
            var operatorUserId = Guid.NewGuid();

            var orderEntity = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                SalesOrderId = 456,
                CustomerName = "Cliente X",
                CustomerEmail = "cliente@example.com",
                PhoneNumber = "123456789",
                Status = Domain.Enums.OrderStatus.Assigned,
                AssignedOperatorId = operatorUserId,
                AssignedDepotTeam = null,
                Missings = null,
                DeliveryDetail = "Dirección X",
                OrderDate = DateTime.UtcNow.AddDays(-2),
                Items = new List<DepotOrderItemEntity>
            {
                new DepotOrderItemEntity
                {
                    Id = 1,
                    ProductBrand = "Marca A",
                    ProductName = "Producto A",
                    PackagingType = "Caja",
                    Quantity = 3
                }
            }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId))
                .ReturnsAsync(orderEntity);

            var query = new GetOrderByIdQuery { DepotOrderId = depotOrderId, OperatorUserId = operatorUserId };

            // Act
            var result = await _handler.GetOrderByIdHandler(query);

            // Assert
            result.Should().NotBeNull();
            result.DepotOrderId.Should().Be(depotOrderId);
            result.Items.Should().HaveCount(1);
        }

        [Fact]
        public async Task GetOrderByIdHandler_ShouldThrowKeyNotFoundException_WhenOrderDoesNotExist()
        {
            // Arrange
            var depotOrderId = 123;
            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId))
                .ReturnsAsync((DepotOrderEntity)null);

            var query = new GetOrderByIdQuery { DepotOrderId = 123, OperatorUserId = Guid.NewGuid() };

            // Act
            Func<Task> act = async () => await _handler.GetOrderByIdHandler(query);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {depotOrderId} not found.");
        }

        [Fact]
        public async Task GetOrderByIdHandler_ShouldThrowInvalidOperationException_WhenOrderNotAssignedToOperator()
        {
            // Arrange
            var depotOrderId = 123;
            var assignedOperatorId = Guid.NewGuid();
            var queryOperatorId = Guid.NewGuid();

            var orderEntity = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                AssignedOperatorId = assignedOperatorId
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId))
                .ReturnsAsync(orderEntity);

            var query = new GetOrderByIdQuery { DepotOrderId = depotOrderId, OperatorUserId = queryOperatorId };

            // Act
            Func<Task> act = async () => await _handler.GetOrderByIdHandler(query);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {depotOrderId} is not assigned to operator {queryOperatorId}.");
        }
    }
}
