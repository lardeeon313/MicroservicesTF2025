using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Orders.GetById;
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
/// Pruebas unitarias para GetOrderByIdQueryHandler.
/// </summary>
public class GetOrderByIdQueryHandlerTests
{
    private readonly Mock<IOrderRepository> _repositoryMock;
    private readonly GetOrderByIdQueryHandler _handler;

    public GetOrderByIdQueryHandlerTests()
    {
        _repositoryMock = new Mock<IOrderRepository>();
        _handler = new GetOrderByIdQueryHandler(_repositoryMock.Object);    
    }

    [Fact(DisplayName = "Debe retornar una orden por ID")]
    public async Task HandleAsync_ShouldReturnOrder_WhenFound()
    {
        // Arrange
        var order = new Order { Id = 5, CustomerId = Guid.NewGuid(), Status = OrderStatus.Confirmed };
        _repositoryMock.Setup(r => r.GetByIdAsync(order.Id)).ReturnsAsync(order);

        // Act
        var query = new GetOrderByIdQuery(order.Id);
        var result = await _handler.Handle(query);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(order.Id);
    }

    [Fact(DisplayName = "Debe lanzar excepción si no se encuentra la orden")]
    public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Order)null!);

        var queryParameter = new GetOrderByIdQuery(999); // ID que no existe
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.Handle(queryParameter));
    }
}
