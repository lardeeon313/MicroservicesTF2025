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
    /// Pruebas unitarias para GetOrderByCustomerIdQueryHandler.
    /// </summary>
    public class GetOrderByCustomerIdQueryHandlerTests
    {
        private readonly GetOrderByIdCustomerQueryHandler _handler;
        private readonly Mock<IOrderRepository> _repositoryMock;

        public GetOrderByCustomerIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<IOrderRepository>();
            _handler = new GetOrderByIdCustomerQueryHandler(_repositoryMock.Object);
        }

        [Fact(DisplayName = "Debe retornar todos los pedidos de un cliente")]
        public async Task HandleAsync_ShouldReturnOrdersByCustomer()
        {
            var customerId = Guid.NewGuid();
            var orders = new List<Order>
        {
            new() { Id = 1, CustomerId = customerId },
            new() { Id = 2, CustomerId = customerId }
        };

            _repositoryMock.Setup(r => r.GetByCustomerIdAsync(customerId)).ReturnsAsync(orders);

            var command = new GetOrderByIdCustomerQuery(customerId);

            var result = await _handler.HandleAsync(command);

            result.Should().NotBeNull().And.HaveCount(2);
            result.All(o => o.CustomerId == customerId).Should().BeTrue();
        }
    }

