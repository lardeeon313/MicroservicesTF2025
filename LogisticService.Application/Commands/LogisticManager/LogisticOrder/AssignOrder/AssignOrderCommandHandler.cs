using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder
{
    public class AssignOrderCommandHandler(IRabbitMQPublisher publisher,ILogisticOrderRepository repository, IDeliveryTeamRepository teamRepository, ILogger<AssignOrderCommandHandler> logger) : IAssignOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly IDeliveryTeamRepository _teamRepository = teamRepository;
        private readonly ILogger<AssignOrderCommandHandler> _logger = logger;
        private readonly IRabbitMQPublisher _publisher = publisher;

        /// <summary>
        /// Handler para asignar una orden a un operario y su equipo.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task HandleAsync(AssignOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
                throw new KeyNotFoundException($"Order with ID {command.LogisticOrderId} not found.");

            // Buscar el equipo en base al operador
            var team = await _teamRepository.GetTeamByOperatorAsync(command.OperatorUserId);

            if (team == null)
                throw new InvalidOperationException("El operador no está asignado a ningún equipo.");

            if (order.Status != OrderStatus.AssignedDelivery)
            {
                var statusHistory = new OrderStatusHistory
                {
                    OrderId = order.DepotOrderId,
                    OldStatus = order.Status,
                    NewStatus = OrderStatus.AssignedDelivery,
                    ChangedAt = DateTime.UtcNow,
                };
            }

            // ✅ asignar operador + equipo encontrado
            order.AssignToOperator(command.OperatorUserId, team);
            await _repository.UpdateAsync(order);
            _logger.LogInformation("✅ Orden {Id} asignada al operador {Operator}", order.DepotOrderId, order.AssignedOperatorId);

            var integrationEvent = new OrderAssignDeliveryIntegrationEvent
            {
                LogisticOrderId = command.LogisticOrderId,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                AssignedDeliveryAt = DateTime.UtcNow,
            };

            // Publicar el evento de orden confirmada
            await _publisher.PublishAsync(integrationEvent, "order_assigndelivery_queue");

            _logger.LogInformation("✅ Evento OrderAssignDeliveryIntegrationEvent publicado para la orden {DepotOrderId}", order.DepotOrderId);
        }
    }
}
