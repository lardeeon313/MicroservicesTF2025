using DepotService.Application.Commands.DepotManager.OrderMissingReported;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Common.Interfaces;
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

namespace DepotService.Test.Commands.DepotManager
{
    /// <summary>
    /// Test unitario para el handler OrderMissingReportedCommandHandler.
    /// </summary>
    public class ReportOrderMissingHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<OrderMissingReportedCommandHandler>> _loggerMock;
        private readonly OrderMissingReportedCommandHandler _handler;
        private readonly Mock<IEmailService> _emailServiceMock;

        public ReportOrderMissingHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<OrderMissingReportedCommandHandler>>();
            _emailServiceMock = new Mock<IEmailService>();

            _handler = new OrderMissingReportedCommandHandler(
                _emailServiceMock.Object, // Se agregó el servicio de correo electrónico requerido
                _publisherMock.Object,
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Test que verifica que el pedido se reporte correctamente como faltante 
        /// cuando la orden existe.
        /// </summary>
        [Fact]
        public async Task OrderMissingHandle_ShouldReportMissingOrder_WhenOrderExists()
        {
            // Arrange
            var command = new OrderMissingReportedCommand(
                1,
                new List<DepotOrderItemsReportedDto>
                {
                    new() { OrderItemId = 100, Quantity = 2, ProductBrand = "MarcaX", ProductName = "ProductoX", Packaging = "Caja" }
                },
                "Faltante parcial",
                "Faltan 2 unidades del ProductoX"
            );

            var depotOrder = new DepotOrderEntity
            {
                DepotOrderId = 1,
                SalesOrderId = 999,
                Status = OrderStatus.Assigned
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync(depotOrder);

            _repositoryMock.Setup(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()))
                .Returns(Task.CompletedTask);

            _repositoryMock.Setup(r => r.AddMissingOrderAsync(It.IsAny<DepotOrderMissing>()))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            _publisherMock.Setup(p => p.PublishAsync(
                It.IsAny<OrderMissingReportedIntegrationEvent>(),
                "order_missing_reported_queue"))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.OrderMissingHandle(command);

            // Assert
            result.Should().BeTrue();

            // Verifica interacciones
            _repositoryMock.Verify(r => r.GetByIdAsync(command.DepotOrderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.Is<DepotOrderEntity>(o => o.Status == OrderStatus.PendingResolution)), Times.Once);
            _repositoryMock.Verify(r => r.AddMissingOrderAsync(It.IsAny<DepotOrderMissing>()), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderMissingReportedIntegrationEvent>(), "order_missing_reported_queue"), Times.Once);
        }

        /// <summary>
        /// ❌ Test que verifica que si la orden no existe, 
        /// no se realice ninguna operación y se retorne false.
        /// </summary>
        [Fact]
        public async Task OrderMissingHandle_ShouldReturnFalse_WhenOrderDoesNotExist()
        {
            // Arrange
            var command = new OrderMissingReportedCommand(
                999, // ID que no existe
                new List<DepotOrderItemsReportedDto>(),
                "Faltante total",
                "No se encontró la orden"
            );

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null); // Simula que no existe

            // Act
            var result = await _handler.OrderMissingHandle(command);

            // Assert
            result.Should().BeFalse();

            // Verifica que NO se llaman los métodos posteriores
            _repositoryMock.Verify(r => r.GetByIdAsync(command.DepotOrderId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _repositoryMock.Verify(r => r.AddMissingOrderAsync(It.IsAny<DepotOrderMissing>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<OrderMissingReportedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }
    }
}
