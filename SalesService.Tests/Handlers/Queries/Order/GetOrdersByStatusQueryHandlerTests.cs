using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Orders.GetByIdCustomer;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers;

/// <summary>
/// Pruebas unitarias para GetOrdersByCustomerIdQueryHandler.
/// </summary>
public class GetOrdersByCustomerIdQueryHandlerTests
{
    private readonly Mock<IOrderRepository> _repositoryMock;
    private readonly GetOrderByIdCustomerQueryHandler _handler;

    public GetOrdersByCustomerIdQueryHandlerTests()
    {
        _repositoryMock = new Mock<IOrderRepository>();
        _handler = new GetOrderByIdCustomerQueryHandler(_repositoryMock.Object);
    }

    [Fact(DisplayName = "Debe retornar todos los pedidos de un cliente")]
    public async Task HandleAsync_ShouldReturnOrdersByCustomer()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var orders = new List<Order>
    {
        new() { Id = 1, CustomerId = customerId },
        new() { Id = 2, CustomerId = customerId }
    };

        // Simular el comportamiento del repositorio
        _repositoryMock.Setup(r => r.GetByCustomerIdAsync(customerId)).ReturnsAsync(orders);

        // Act
        var query = new GetOrderByIdCustomerQuery(customerId);
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().NotBeNull().And.HaveCount(2);
        result.All(o => o.CustomerId == customerId).Should().BeTrue();
    }
}
