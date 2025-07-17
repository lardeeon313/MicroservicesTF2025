using DepotService.Application.Commands.DepotOperator.MarkItemReady;
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

namespace DepotService.Test.Commands.DepotOperator
{
    public class MarkItemCommandHandlerTest
    {
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<MarkItemCommandHandler>> _loggerMock;
        private readonly MarkItemCommandHandler _handler;

        public MarkItemCommandHandlerTest()
        {
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<MarkItemCommandHandler>>();

            _handler = new MarkItemCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Marca un ítem correctamente como listo y no cambia estado de la orden (no todos están listos).
        /// </summary>
        [Fact]
        public async Task MarkItem_ShouldMarkItemAsReady_WhenValid()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var orderItemId = 1;
            var orderId = 100;

            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                AssignedOperatorId = operatorId,
                Status = OrderStatus.InPreparation
            };

            var item = new DepotOrderItemEntity
            {
                Id = orderItemId,
                DepotOrderEntityId = orderId,
                DepotOrderEntity = order,
                IsReady = false
            };

            var command = new MarkItemCommand
            {
                OrderItemId = orderItemId,
                OperatorUserId = operatorId
            };

            var itemsDbSet = TestHelpers.CreateDbSetMock(new List<DepotOrderItemEntity> { item });
            _contextMock.Setup(c => c.DepotOrderItems).Returns(itemsDbSet.Object);

            // Act
            var result = await _handler.MarkItemHandler(command);

            // Assert
            result.Should().BeTrue();
            item.IsReady.Should().BeTrue();

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderPreparedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }

        /// <summary>
        /// ✅ Marca el ítem como listo y actualiza la orden a estado "Prepared" cuando todos los ítems están listos.
        /// </summary>
        [Fact]
        public async Task MarkItem_ShouldSetOrderToPrepared_WhenAllItemsAreReady()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var orderId = 100;
            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                AssignedOperatorId = operatorId,
                Status = OrderStatus.InPreparation
            };

            var item1 = new DepotOrderItemEntity
            {
                Id = 1,
                DepotOrderEntityId = orderId,
                DepotOrderEntity = order,
                IsReady = false
            };

            var item2 = new DepotOrderItemEntity
            {
                Id = 2,
                DepotOrderEntityId = orderId,
                DepotOrderEntity = order,
                IsReady = true // Ya está listo
            };

            var command = new MarkItemCommand
            {
                OrderItemId = 1,
                OperatorUserId = operatorId
            };

            var itemsDbSet = TestHelpers.CreateDbSetMock(new List<DepotOrderItemEntity> { item1, item2 });
            _contextMock.Setup(c => c.DepotOrderItems).Returns(itemsDbSet.Object);

            _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
                .Returns(Task.CompletedTask);

            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderPreparedIntegrationEvent>(), "order_prepared_queue"))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.MarkItemHandler(command);

            // Assert
            result.Should().BeTrue();
            item1.IsReady.Should().BeTrue();
            order.Status.Should().Be(OrderStatus.Prepared);

            _repositoryMock.Verify(r => r.UpdateOrderAsync(order), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderPreparedIntegrationEvent>(), "order_prepared_queue"), Times.Once);
        }

        /// <summary>
        /// ❌ Lanza excepción cuando el ítem no existe.
        /// </summary>
        [Fact]
        public async Task MarkItem_ShouldThrow_WhenItemNotFound()
        {
            // Arrange
            var command = new MarkItemCommand
            {
                OrderItemId = 999,
                OperatorUserId = Guid.NewGuid()
            };

            var itemsDbSet = TestHelpers.CreateDbSetMock(new List<DepotOrderItemEntity>());
            _contextMock.Setup(c => c.DepotOrderItems).Returns(itemsDbSet.Object);

            // Act
            var act = async () => await _handler.MarkItemHandler(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Item with ID {command.OrderItemId} not found.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderPreparedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }

        /// <summary>
        /// ❌ Lanza excepción cuando el operador no es el asignado a la orden.
        /// </summary>
        [Fact]
        public async Task MarkItem_ShouldThrow_WhenOperatorIsNotAssigned()
        {
            // Arrange
            var orderId = 100;
            var item = new DepotOrderItemEntity
            {
                Id = 1,
                DepotOrderEntityId = orderId,
                DepotOrderEntity = new DepotOrderEntity
                {
                    DepotOrderId = orderId,
                    AssignedOperatorId = Guid.NewGuid(), // Operador diferente
                }
            };

            var command = new MarkItemCommand
            {
                OrderItemId = 1,
                OperatorUserId = Guid.NewGuid()
            };

            var itemsDbSet = TestHelpers.CreateDbSetMock(new List<DepotOrderItemEntity> { item });
            _contextMock.Setup(c => c.DepotOrderItems).Returns(itemsDbSet.Object);

            // Act
            var act = async () => await _handler.MarkItemHandler(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Item with ID {command.OrderItemId} is not assigned to operator {command.OperatorUserId}.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderPreparedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }

        public static class TestHelpers
        {
            public static Mock<DbSet<T>> CreateDbSetMock<T>(IEnumerable<T> elements) where T : class
            {
                var queryable = elements.AsQueryable();

                var dbSetMock = new Mock<DbSet<T>>();
                dbSetMock.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
                dbSetMock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
                dbSetMock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
                dbSetMock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());

                return dbSetMock;
            }
        }
    }
}
