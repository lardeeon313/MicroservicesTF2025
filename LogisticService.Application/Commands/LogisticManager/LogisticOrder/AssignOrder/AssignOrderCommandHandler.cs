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
    public class AssignOrderCommandHandler(IRabbitMQPublisher publisher, ILogisticOrderRepository repository, IDeliveryTeamRepository teamRepository, ILogger<AssignOrderCommandHandler> logger) : IAssignOrderCommandHandler
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
        public async Task<bool> HandleAsync(AssignOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("No se encontró la orden logística con ID: {LogisticOrderId}", command.LogisticOrderId);
                return false;
            }

            // Buscar el equipo en base al operador
            var team = await _teamRepository.GetTeamByOperatorAsync(command.OperatorUserId);

            if (team == null)
            {
                _logger.LogError("No se encontró un equipo asociado al operador con ID: {OperatorUserId}", command.OperatorUserId);
                return false;
            }

            try
            {               
                order.AssignToOperator(command.OperatorUserId, team);
            }
            catch (InvalidOperationException ex)
            {
                // Capturamos si la regla de negocio falló (ej: la orden no estaba en 'Verified')
                _logger.LogWarning(ex,
                    "Error de validación al asignar la orden {LogisticOrderId}: {ErrorMessage}",
                    command.LogisticOrderId,
                    ex.Message);
                return false; // Indicamos que la operación falló
            }

            // Si el método de dominio fue exitoso, guardamos los cambios
            await _repository.UpdateAsync(order);

            _logger.LogInformation("✅ Orden {Id} asignada al operador {Operator}", order.DepotOrderId, order.AssignedOperatorId);

            // Publicar el evento de integración
            var integrationEvent = new OrderAssignDeliveryIntegrationEvent
            {
                LogisticOrderId = command.LogisticOrderId,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                AssignDeliveryAt = DateTime.UtcNow,
            };

            // Publicar el evento de orden confirmada
            // (Considera agregar un try/catch aquí también si la publicación es crítica)
            await _publisher.PublishAsync(integrationEvent, "order_assigndelivery_queue");

            _logger.LogInformation("✅ Evento OrderAssignDeliveryIntegrationEvent publicado para la orden {DepotOrderId}", order.DepotOrderId);
            return true;
        }
    }
}