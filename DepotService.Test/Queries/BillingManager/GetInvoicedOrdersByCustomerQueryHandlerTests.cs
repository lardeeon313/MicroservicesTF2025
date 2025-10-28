using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.BillingManager
{
    public class GetInvoicedOrdersByCustomerQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetInvoicedOrdersByCustomerQueryHandler>> _loggerMock;
        private readonly GetInvoicedOrdersByCustomerQueryHandler _handler;

        public GetInvoicedOrdersByCustomerQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetInvoicedOrdersByCustomerQueryHandler>>();

            _handler = new GetInvoicedOrdersByCustomerQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact]
        public async Task GetInvoicedOrdersByCustomerAsync_WhenNoOrdersFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var customerName = Guid.NewGuid().ToString();
            var query = new GetInvoicedOrdersByCustomerQuery(customerName);

            _repositoryMock.Setup(r => r.GetInvoicedOrdersByCustomerAsync(customerName))
                .ReturnsAsync(new List<DepotOrderEntity>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _handler.GetInvoicedOrdersByCustomerAsync(query));

            Assert.Equal($"No invoiced orders found for customer with ID {customerName}.", exception.Message);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains($"No invoiced orders found for customer with ID {customerName}.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetInvoicedOrdersByCustomerAsync_WhenOrdersExist_ReturnsDepotOrderDtoList()
        {
            // Arrange
            var customerName = Guid.NewGuid().ToString();
            var query = new GetInvoicedOrdersByCustomerQuery(customerName.ToString());

            var orders = new List<DepotOrderEntity>
        {
            new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 100,
                CustomerName = "Cliente Uno",
                CustomerEmail = "cliente1@email.com",
                PhoneNumber = "123456",
                TotalAmount = 300m,
                DeliveryDetail = "Calle A",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 1,
                        ProductBrand = "Marca1",
                        ProductName = "Producto1",
                        PackagingType = "Caja",
                        Quantity = 2,
                        UnitPrice = 150m
                    }
                }
            },
            new DepotOrderEntity
            {
                DepotOrderId = 2,
                SalesOrderId = 101,
                CustomerName = "Cliente Uno",
                CustomerEmail = "cliente1@email.com",
                PhoneNumber = "123456",
                TotalAmount = 500m,
                DeliveryDetail = "Calle B",
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Invoiced,
                Items = new List<DepotOrderItemEntity>
                {
                    new DepotOrderItemEntity
                    {
                        Id = 2,
                        ProductBrand = "Marca2",
                        ProductName = "Producto2",
                        PackagingType = "Bolsa",
                        Quantity = 5,
                        UnitPrice = 100m
                    }
                }
            }
        };

            _repositoryMock.Setup(r => r.GetInvoicedOrdersByCustomerAsync(customerName))
                .ReturnsAsync(orders);

            // Act
            var result = await _handler.GetInvoicedOrdersByCustomerAsync(query);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            Assert.Collection(result,
                order =>
                {
                    Assert.Equal(1, order.DepotOrderId);
                    Assert.Equal(300m, order.TotalAmount);
                    Assert.Single(order.Items);
                    Assert.Equal(300m, order.Items.First().Total);
                },
                order =>
                {
                    Assert.Equal(2, order.DepotOrderId);
                    Assert.Equal(500m, order.TotalAmount);
                    Assert.Single(order.Items);
                    Assert.Equal(500m, order.Items.First().Total);
                });

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains($"Found 2 invoiced orders for customer with ID {customerName}.")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }

}
