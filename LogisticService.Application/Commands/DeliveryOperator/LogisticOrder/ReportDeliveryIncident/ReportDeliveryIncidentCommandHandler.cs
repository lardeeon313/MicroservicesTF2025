using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident
{
    public class ReportDeliveryIncidentCommandHandler(IRabbitMQPublisher publisher ,ILogisticOrderRepository repository, ILogger<ReportDeliveryIncidentCommandHandler> logger) : IReportDeliveryIncidentCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<ReportDeliveryIncidentCommandHandler> _logger = logger;

        /// <summary>
        /// Handler para reportar un incidente en una orden logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> ReportIncidentAsync(ReportDeliveryIncidentCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", command.LogisticOrderId);
                return false;
            }

            // Verificar que esté en estado OnTheWay
            if (order.Status != OrderStatus.OnTheWay)
            {
                _logger.LogWarning("Order {OrderId} is not OnTheWay. Cannot report incident.", command.LogisticOrderId);
                return false;
            }

            // Crear registro de incidencia
            var incident = new DeliveryIncident
            {
                LogisticOrderId = order.Id,
                ReportedByOperatorId = command.OperatorUserId,
                IncidentType = command.IncidentType,
                Description = command.Description,
                ReportedAt = DateTime.UtcNow
            };
            await _repository.AddDeliveryIncidentAsync(incident);

            // Cambiar estado del pedido
            var oldStatus = order.Status;
            order.Status = OrderStatus.PendingIncidentResolution;

            // Registrar cambio de estado
            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                LogisticOrder = order,
                OldStatus = oldStatus,
                NewStatus = OrderStatus.PendingIncidentResolution,
                ChangedAt = DateTime.UtcNow
            };
            await _repository.AddStatusHistoryAsync(statusHistory);

            await _repository.UpdateAsync(order);
            _logger.LogInformation("Incident reported for order {OrderId} by operator {OperatorUserId}", order.Id, command.OperatorUserId);

            // TODO: Emitir evento de integración
            // e.g. await _eventPublisher.PublishAsync(new DeliveryIncidentReportedIntegrationEvent(order.Id, command.OperatorUserId, command.IncidentType));

            var integrationEvent = new OrderDeliveryIncidentIntegrationEvent
            {
                LogisticOrderId = order.Id,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                DeliveryIncidentAt = DateTime.UtcNow,
            };

            // Publicar el evento de notificacion de cambio de estado
            await _publisher.PublishToExchangeAsync(integrationEvent, "order_delivery_incident_exchange");

            return true;
        }
    }
}
