using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Orders.GetAll;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers;

/// <summary>
/// Pruebas unitarias para GetAllOrdersQueryHandler.
/// </summary>
/// <param name="handler"></param>
public class GetAllOrdersQueryHandlerTests
{
    private readonly GetAllOrdersQueryHandler _handler;
    private readonly Mock<IOrderRepository> _repositoryMock;

    public GetAllOrdersQueryHandlerTests()
    {
        _repositoryMock = new Mock<IOrderRepository>();
        _handler = new GetAllOrdersQueryHandler(_repositoryMock.Object);
    }

    [Fact(DisplayName = "Debe retornar todos los pedidos existentes")]
    public async Task HandleAsync_ShouldReturnAllOrders()
    {
        // Arrange
        var orders = new List<Order>
    {
        new() { Id = 1, CustomerId = Guid.NewGuid(), Status = OrderStatus.Pending },
        new() { Id = 2, CustomerId = Guid.NewGuid(), Status = OrderStatus.Issued }
    };

        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(orders);

        // Act
        var result = await _handler.Handle();

        // Assert
        result.Should().NotBeNull().And.HaveCount(2);
        result.First().Id.Should().Be(1);
    }
}
