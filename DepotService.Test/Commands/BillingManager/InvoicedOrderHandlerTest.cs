using DepotService.Application.Commands.BillingManager.InvoicedOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.BillingManager
{
    /// <summary>
    /// Tests unitarios para InvoiceOrderCommandHandler.
    /// </summary>
    public class InvoiceOrderCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<InvoiceOrderCommandHandler>> _loggerMock;
        private readonly InvoiceOrderCommandHandler _handler;

        public InvoiceOrderCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<InvoiceOrderCommandHandler>>();

            _handler = new InvoiceOrderCommandHandler(
                _publisherMock.Object,
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Debe facturar correctamente cuando la orden existe y es válida.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldInvoiceOrder_WhenOrderIsValid()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 1,
                Status = OrderStatus.SentToBilling,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Quantity = 2, UnitPrice = 50, SalesOrderItemId = 1001 },
                    new() { Quantity = 1, UnitPrice = 100, SalesOrderItemId = 1002 }
                }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(default))
                .ReturnsAsync(1);

            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderInvoicedIntegrationEvent>(), "order_invoiced_queue"))
                .Returns(Task.CompletedTask);

            var command = new InvoiceOrderCommand(order.DepotOrderId);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            result.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.Invoiced);
            order.TotalAmount.Should().Be(200);

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInvoicedIntegrationEvent>(), "order_invoiced_queue"), Times.Once);
        }

        /// <summary>
        /// ❌ Debe lanzar excepción si la orden no existe.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new InvoiceOrderCommand(999);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {command.DepotOrderId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.DepotOrderId), Times.Once);
        }

        /// <summary>
        /// ❌ Debe lanzar excepción si la orden no está en estado SentToBilling.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotInSentToBillingStatus()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 5,
                Status = OrderStatus.Received,
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            var command = new InvoiceOrderCommand(order.DepotOrderId);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {command.DepotOrderId} is not in the correct status to be invoiced.");

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
        }

        /// <summary>
        /// ❌ Debe lanzar excepción si algún item no tiene precio válido.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenItemHasNoValidUnitPrice()
        {
            // Arrange
            var order = new DepotOrderEntity
            {
                DepotOrderId = 6,
                Status = OrderStatus.SentToBilling,
                Items = new List<DepotOrderItemEntity>
                {
                    new() { Quantity = 2, UnitPrice = null, SalesOrderItemId = 1003 }
                }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            var command = new InvoiceOrderCommand(order.DepotOrderId);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {command.DepotOrderId} has items without valid unit prices.");

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
        }
    }
}
