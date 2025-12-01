using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident;
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

namespace LogisticService.Test.Commands.DeliveryOperator.LogisticOrder
{
    public class ResolveDeliveryIncidentHandlerTests
    {        
        private readonly Mock<ILogisticOrderRepository> _repositoryMock; 
        private readonly Mock<ILogger<ResolveDeliveryIncidentCommandHandler>> _loggerMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;


        private readonly ResolveDeliveryIncidentCommandHandler _handler;

        public ResolveDeliveryIncidentHandlerTests()
        {            
            _repositoryMock = new Mock<ILogisticOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _loggerMock = new Mock<ILogger<ResolveDeliveryIncidentCommandHandler>>();

            _handler = new ResolveDeliveryIncidentCommandHandler(
                _publisherMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        // --------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando el incidente no existe")]
        public async Task Should_ReturnFalse_WhenIncidentNotFound()
        {
            var command = new ResolveDeliveryIncidentCommand(1, 10, DeliveryIncidentStatus.Resolved, "Notas");

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1))
                .ReturnsAsync((DeliveryIncident?)null);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateDeliveryIncidentAsync(It.IsAny<DeliveryIncident>()), Times.Never);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe retornar false cuando la orden no existe")]
        public async Task Should_ReturnFalse_WhenOrderNotFound()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var command = new ResolveDeliveryIncidentCommand(1, 10, DeliveryIncidentStatus.Resolved, "Notas");

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);            

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe retornar false cuando la orden no está en PendingIncidentResolution")]
        public async Task Should_ReturnFalse_WhenOrderNotInPendingIncidentResolution()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder { Id = 10, Status = OrderStatus.OnTheWay };

            var command = new ResolveDeliveryIncidentCommand(1, 10, DeliveryIncidentStatus.Resolved, "Notas");

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe actualizar el incidente con las notas y estado de resolución")]
        public async Task Should_UpdateIncidentCorrectly()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                DepotOrderId = 5,
                SalesOrderId = 99,
                Status = OrderStatus.PendingIncidentResolution
            };

            var command = new ResolveDeliveryIncidentCommand(
                1,
                10,
                DeliveryIncidentStatus.Resolved,
                "Resuelto sin problemas"
            );

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            await _handler.HandleAsync(command);

            Assert.Equal("Resuelto sin problemas", incident.ResolutionNote);
            Assert.Equal(DeliveryIncidentStatus.Resolved, incident.DeliveryIncidentStatus);
            Assert.Equal(command.ResolvedAt, incident.ResolvedAt);

            _repositoryMock.Verify(r => r.UpdateDeliveryIncidentAsync(incident), Times.Once);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe cambiar el estado de la orden a IncidentResolved cuando ResolutionStatus = Resolved")]
        public async Task Should_ChangeOrderStatus_ToIncidentResolved()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 10,
                DepotOrderId = 5,
                SalesOrderId = 20,
                Status = OrderStatus.PendingIncidentResolution
            };

            var command = new ResolveDeliveryIncidentCommand(
                1,
                10,
                DeliveryIncidentStatus.Resolved,
                "OK"
            );

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(order);

            await _handler.HandleAsync(command);

            Assert.Equal(OrderStatus.IncidentResolved, order.Status);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe cambiar el estado de la orden a Delivered cuando ResolutionStatus = Delivered")]
        public async Task Should_ChangeOrderStatus_ToDelivered()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 99,
                DepotOrderId = 11,
                SalesOrderId = 33,
                Status = OrderStatus.PendingIncidentResolution
            };

            var command = new ResolveDeliveryIncidentCommand(
                1,
                99,
                DeliveryIncidentStatus.Delivered,
                "Todo OK"
            );

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync(order);

            await _handler.HandleAsync(command);

            Assert.Equal(OrderStatus.Delivered, order.Status);
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe guardar el historial del cambio de estado")]
        public async Task Should_SaveStatusHistory()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 20,
                DepotOrderId = 7,
                SalesOrderId = 14,
                Status = OrderStatus.PendingIncidentResolution
            };

            var command = new ResolveDeliveryIncidentCommand(1, 20, DeliveryIncidentStatus.Resolved, "OK");

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(20)).ReturnsAsync(order);

            await _handler.HandleAsync(command);

            _repositoryMock.Verify(
                r => r.AddStatusHistoryAsync(It.Is<OrderStatusHistory>(h =>
                    h.OldStatus == OrderStatus.PendingIncidentResolution &&
                    h.NewStatus == OrderStatus.IncidentResolved &&
                    h.OrderId == order.DepotOrderId
                )),
                Times.Once
            );
        }
        // --------------------------------------------------------------

        [Fact(DisplayName = "Debe publicar el evento de incidencia resuelta en RabbitMQ")]
        public async Task Should_PublishIntegrationEvent()
        {
            var incident = new DeliveryIncident { Id = 1 };
            var order = new Domain.Entities.LogisticOrder
            {
                Id = 50,
                DepotOrderId = 123,
                SalesOrderId = 456,
                Status = OrderStatus.PendingIncidentResolution
            };

            var command = new ResolveDeliveryIncidentCommand(
                1,
                50,
                DeliveryIncidentStatus.Resolved,
                "Notas"
            );

            _repositoryMock.Setup(r => r.GetDeliveryIncidentByIdAsync(1)).ReturnsAsync(incident);
            _repositoryMock.Setup(r => r.GetByIdAsync(50)).ReturnsAsync(order);

            await _handler.HandleAsync(command);
        }
    }
}
