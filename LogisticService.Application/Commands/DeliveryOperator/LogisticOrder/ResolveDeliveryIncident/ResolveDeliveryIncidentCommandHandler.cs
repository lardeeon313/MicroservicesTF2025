using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident
{
    public class ResolveDeliveryIncidentCommandHandler(ILogisticOrderRepository repository, ILogger<ResolveDeliveryIncidentCommandHandler> logger) : IResolveDeliveryIncidentCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<ResolveDeliveryIncidentCommandHandler> _logger = logger;

        /// <summary>
        /// Handler para resolver un incidente en una orden logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> HandleAsync(ResolveDeliveryIncidentCommand command)
        {
            var incident = await _repository.GetDeliveryIncidentByIdAsync(command.IncidentId);
            if (incident == null)
            {
                _logger.LogWarning("Incident with ID {IncidentId} not found", command.IncidentId);
                return false;
            }

            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", command.LogisticOrderId);
                return false;
            }

            // Verificamos que la orden esté en estado PendingIncidentResolution
            if (order.Status != OrderStatus.PendingIncidentResolution)
            {
                _logger.LogWarning("Order {OrderId} is not PendingIncidentResolution. Cannot resolve incident.", command.LogisticOrderId);
                return false;
            }

            // Actualizamos la incidencia
            incident.ResolutionNote = command.ResolutionNotes;
            incident.DeliveryIncidentStatus = command.ResolutionStatus;
            incident.ResolvedAt = command.ResolvedAt;

            await _repository.UpdateDeliveryIncidentAsync(incident);

            // Actualizamos el estado de la orden según la resolución
            var oldStatus = order.Status;

            switch (command.ResolutionStatus)
            {
                case DeliveryIncidentStatus.Resolved:
                    order.Status = OrderStatus.IncidentResolved;
                    break;
                case DeliveryIncidentStatus.Delivered:
                    order.Status = OrderStatus.Delivered;
                    break;                    
                default:
                    order.Status = OrderStatus.PendingIncidentResolution;
                    break;
            }

            // Guardamos historial
            var history = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                LogisticOrder = order,
                OldStatus = oldStatus,
                NewStatus = order.Status,
                ChangedAt = DateTime.UtcNow
            };
            await _repository.AddStatusHistoryAsync(history);

            await _repository.UpdateAsync(order);

            _logger.LogInformation("Incident {IncidentId} resolved with status {Status} for order {OrderId}",
                command.IncidentId, command.ResolutionStatus, command.LogisticOrderId);

            return true;

        }
    }
}
