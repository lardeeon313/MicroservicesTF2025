using DepotService.Application.Commands.DepotOperator.UnMarkItemReady;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
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
    /// <summary>
/// Tests para el handler UnmarkItemReadyCommandHandler.
/// </summary>
public class UnmarkItemReadyCommandHandlerTests
{
    private readonly Mock<IRabbitMQPublisher> _publisherMock;
    private readonly Mock<DepotDbContext> _contextMock;
    private readonly Mock<IDepotOrderRepository> _repositoryMock;
    private readonly Mock<ILogger<UnmarkItemReadyCommandHandler>> _loggerMock;

    private readonly UnmarkItemReadyCommandHandler _handler;

    public UnmarkItemReadyCommandHandlerTests()
    {
        _publisherMock = new Mock<IRabbitMQPublisher>();
        _contextMock = new Mock<DepotDbContext>();
        _repositoryMock = new Mock<IDepotOrderRepository>();
        _loggerMock = new Mock<ILogger<UnmarkItemReadyCommandHandler>>();

        // Instanciamos el handler con los mocks
        _handler = new UnmarkItemReadyCommandHandler(
            _publisherMock.Object,
            _contextMock.Object,
            _repositoryMock.Object,
            _loggerMock.Object
        );
    }

    /// <summary>
    /// Prueba cuando el item no existe en la base de datos.
    /// </summary>
    [Fact]
    public async Task UnmarkItemReady_ItemNotFound_ReturnsFalseAndLogsError()
    {
        // Arrange: creamos un comando con un OrderItemId
        var command = new UnmarkItemReadyCommand(orderItemId: 1);

        // Simulamos que FindAsync retorna null (no se encuentra el item)
        _contextMock.Setup(c => c.DepotOrderItems.FindAsync(command.OrderItemId))
            .ReturnsAsync((DepotOrderItemEntity?)null);

        // Act: llamamos al handler
        var result = await _handler.UnmarkItemReady(command);

        // Assert: se espera false y que se registre un error
        Assert.False(result);
        _loggerMock.Verify(
            x => x.LogError(It.Is<string>(s => s.Contains("not found"))),
            Times.Once);
    }

    /// <summary>
    /// Prueba cuando la orden relacionada no existe.
    /// </summary>
    [Fact]
    public async Task UnmarkItemReady_OrderNotFound_ReturnsFalseAndLogsError()
    {
        // Arrange: simulamos un item válido
        var command = new UnmarkItemReadyCommand(orderItemId: 1);
        var item = new DepotOrderItemEntity
        {
            Id = 1,
            DepotOrderEntityId = 10,
            IsReady = true
        };

        _contextMock.Setup(c => c.DepotOrderItems.FindAsync(command.OrderItemId))
            .ReturnsAsync(item);

            // Simulamos que la orden no existe
            _ = _repositoryMock.Setup(r => r.GetByIdAsync(item.DepotOrderEntityId))
                .ReturnsAsync((DepotOrderEntity?)null);

        // Act
        var result = await _handler.UnmarkItemReady(command);

        // Assert
        Assert.False(result);
        _loggerMock.Verify(
            x => x.LogError(It.Is<string>(s => s.Contains("not found"))),
            Times.Once);
    }

    /// <summary>
    /// Prueba el caso exitoso donde todos los items quedan no listos, 
    /// entonces se actualiza el estado de la orden y se publica el evento.
    /// </summary>
    [Fact]
    public async Task UnmarkItemReady_AllItemsNotReady_UpdatesOrderStatusAndPublishesEvent()
    {
        // Arrange
        var command = new UnmarkItemReadyCommand(orderItemId: 1);
        var item = new DepotOrderItemEntity
        {
            Id = 1,
            DepotOrderEntityId = 10,
            IsReady = true
        };

        // Simulamos que tras cambiar este item, todos quedan no listos
        var orderItems = new List<DepotOrderItemEntity>
        {
            new DepotOrderItemEntity { Id = 1, IsReady = false },
            new DepotOrderItemEntity { Id = 2, IsReady = false }
        };

        var order = new DepotOrderEntity
        {
            DepotOrderId = 10,
            SalesOrderId = 100,
            Status = Domain.Enums.OrderStatus.Prepared,
            Items = orderItems
        };

        _contextMock.Setup(c => c.DepotOrderItems.FindAsync(command.OrderItemId))
            .ReturnsAsync(item);

        _repositoryMock.Setup(r => r.GetByIdAsync(item.DepotOrderEntityId))
            .ReturnsAsync(order);

        _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
            .Returns(Task.CompletedTask);

        _contextMock.Setup(c => c.SaveChangesAsync(default))
            .ReturnsAsync(1);

        _publisherMock.Setup(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), "order_in_preparation_queue"))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.UnmarkItemReady(command);

        // Assert
        Assert.True(result);
        Assert.Equal(Domain.Enums.OrderStatus.InPreparation, order.Status);

        _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), "order_in_preparation_queue"), Times.Once);
        _loggerMock.Verify(l => l.LogInformation(It.Is<string>(s => s.Contains("status updated to InPreparation")), It.IsAny<object[]>()), Times.Once);
    }

    /// <summary>
    /// Prueba cuando no todos los items quedan no listos (alguno sigue listo),
    /// no se publica evento ni se cambia estado.
    /// </summary>
    [Fact]
    public async Task UnmarkItemReady_NotAllItemsNotReady_DoesNotPublishEvent()
    {
        // Arrange
        var command = new UnmarkItemReadyCommand(orderItemId: 1);
        var item = new DepotOrderItemEntity
        {
            Id = 1,
            DepotOrderEntityId = 10,
            IsReady = true
        };

        // Simulamos que queda al menos un item listo
        var orderItems = new List<DepotOrderItemEntity>
        {
            new DepotOrderItemEntity { Id = 1, IsReady = false }, 
            new DepotOrderItemEntity { Id = 2, IsReady = true }
        };

        var order = new DepotOrderEntity
        {
            DepotOrderId = 10,
            SalesOrderId = 100,
            Status = Domain.Enums.OrderStatus.Prepared,
            Items = orderItems
        };

        _contextMock.Setup(c => c.DepotOrderItems.FindAsync(command.OrderItemId))
            .ReturnsAsync(item);

        _repositoryMock.Setup(r => r.GetByIdAsync(item.DepotOrderEntityId))
            .ReturnsAsync(order);

        _repositoryMock.Setup(r => r.UpdateOrderAsync(order))
            .Returns(Task.CompletedTask);

        _contextMock.Setup(c => c.SaveChangesAsync(default))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.UnmarkItemReady(command);

        // Assert
        Assert.True(result);

        _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderInPreparationIntegrationEvent>(), It.IsAny<string>()), Times.Never);
    }
}
}
