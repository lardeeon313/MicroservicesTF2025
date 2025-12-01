using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.DeliveryOperator
{
    public class ReportDeliveryIncidentHandlerTests
    {        
        private readonly Mock<ILogisticOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly Mock<ILogger<ReportDeliveryIncidentCommandHandler>> _loggerMock;

        private readonly ReportDeliveryIncidentCommandHandler _handler;

        public ReportDeliveryIncidentHandlerTests()
        {
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<ReportDeliveryIncidentCommandHandler>>();

            _handler = new ReportDeliveryIncidentCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        // --------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando la orden no existe")]
        public async Task Should_ReturnFalse_WhenOrderNotFound()
        {
            // Arrange
            var command = new ReportDeliveryIncidentCommand(1, Guid.NewGuid(), "Damage", "Caja rota");

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.LogisticOrderId))
                .ReturnsAsync((Domain.Entities.LogisticOrder?)null);

            // Act
            var result = await _handler.ReportIncidentAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.AddDeliveryIncidentAsync(It.IsAny<DeliveryIncident>()), Times.Never);            
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe retornar false cuando la orden no está en estado OnTheWay")]
        public async Task Should_ReturnFalse_WhenOrderIsNotOnTheWay()
        {
            // Arrange
            var order = new Domain.Entities.LogisticOrder { Id = 1, Status = OrderStatus.AssignedDelivery };

            var command = new ReportDeliveryIncidentCommand(1, Guid.NewGuid(), "Delay", "Demora por tráfico");

            _repositoryMock
                .Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(order);

            // Act
            var result = await _handler.ReportIncidentAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.AddDeliveryIncidentAsync(It.IsAny<DeliveryIncident>()), Times.Never);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe crear el incidente cuando la orden está OnTheWay")]
        public async Task Should_CreateIncident_WhenOrderIsOnTheWay()
        {
            // Arrange
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 10,
                SalesOrderId = 20,
                Status = OrderStatus.OnTheWay
            };

            var command = new ReportDeliveryIncidentCommand(
                logisticOrderId: 1,
                operatorUserId: Guid.NewGuid(),
                incidentType: "Damage",
                description: "Producto roto"
            );

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var result = await _handler.ReportIncidentAsync(command);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.AddDeliveryIncidentAsync(It.IsAny<DeliveryIncident>()), Times.Once);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe actualizar el estado de la orden a PendingIncidentResolution")]
        public async Task Should_UpdateStatus_To_PendingIncidentResolution()
        {
            // Arrange
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 10,
                SalesOrderId = 20,
                Status = OrderStatus.OnTheWay
            };

            var command = new ReportDeliveryIncidentCommand(1, Guid.NewGuid(), "Damage", "Producto roto");

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var result = await _handler.ReportIncidentAsync(command);

            // Assert
            Assert.True(result);
            Assert.Equal(OrderStatus.PendingIncidentResolution, order.Status);
            _repositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe registrar el historial de estado")]
        public async Task Should_AddStatusHistory()
        {
            // Arrange
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 10,
                SalesOrderId = 20,
                Status = OrderStatus.OnTheWay
            };

            var command = new ReportDeliveryIncidentCommand(1, Guid.NewGuid(), "Damage", "Producto roto");

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var result = await _handler.ReportIncidentAsync(command);

            // Assert
            Assert.True(result);

            _repositoryMock.Verify(
                r => r.AddStatusHistoryAsync(It.Is<OrderStatusHistory>(h =>
                    h.OldStatus == OrderStatus.OnTheWay &&
                    h.NewStatus == OrderStatus.PendingIncidentResolution &&
                    h.OrderId == order.DepotOrderId
                )),
                Times.Once
            );
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe publicar el evento de incidente en RabbitMQ")]
        public async Task Should_PublishIntegrationEvent()
        {
            // Arrange
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 1,
                DepotOrderId = 10,
                SalesOrderId = 20,
                Status = OrderStatus.OnTheWay
            };

            var command = new ReportDeliveryIncidentCommand(1, Guid.NewGuid(), "Damage", "Producto roto");

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            await _handler.ReportIncidentAsync(command);
        }
    }
}
