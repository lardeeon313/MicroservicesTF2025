using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Orders.GetAll;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.CustomerEntity;
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
            new()
            {
                Id = 1,
                CustomerId = Guid.NewGuid(),
                Status = OrderStatus.Pending,
                Customer = new Customer { FirstName = "Juan", LastName = "Pérez" },
                Items = new List<OrderItem>(),
                DeliveryAddress = new Address()
            },
            new()
            {
                Id = 2,
                CustomerId = Guid.NewGuid(),
                Status = OrderStatus.Issued,
                Customer = new Customer { FirstName = "Ana", LastName = "Gómez" },
                Items = new List<OrderItem>(),
                DeliveryAddress = new Address()
            }
        };

        _repositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(orders);

        // Act
        var result = await _handler.Handle();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);

        var list = result.ToList();
        list[0].Id.Should().Be(1);
        list[0].CustomerFirstName.Should().Be("Juan");
        list[1].Id.Should().Be(2);
    }
}
