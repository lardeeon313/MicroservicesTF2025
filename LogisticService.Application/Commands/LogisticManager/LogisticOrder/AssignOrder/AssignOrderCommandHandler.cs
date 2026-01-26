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
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder
{
    public class AssignOrderCommandHandler : IAssignOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository;
        private readonly IDeliveryTeamRepository _teamRepository;
        private readonly ILogger<AssignOrderCommandHandler> _logger;
        private readonly IRabbitMQPublisher _publisher;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AssignOrderCommandHandler(
            IRabbitMQPublisher publisher,
            ILogisticOrderRepository repository,
            IDeliveryTeamRepository teamRepository,
            ILogger<AssignOrderCommandHandler> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _teamRepository = teamRepository;
            _logger = logger;
            _publisher = publisher;
            _httpContextAccessor = httpContextAccessor;
        }

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

            // Determinar zona
            int? selectedZoneId = command.DeliveryZoneId;

            if (selectedZoneId == null)
            {
                selectedZoneId = team.ZoneAssignments
                    .FirstOrDefault(z => z.IsActive)?.DeliveryZoneId;
            }

            if (selectedZoneId == null)
            {
                _logger.LogError("El equipo {TeamId} no tiene zonas activas y no se especificó una zona en la asignación.", team.Id);
                return false;
            }

            // ✅ Obtener el usuario actual que está haciendo la asignación
            Guid? assignedByUserId = null;
            try
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
                {
                    assignedByUserId = userId;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "No se pudo obtener el ID del usuario actual para AssignedByUserId");
            }

            try
            {
                // ✅ Pasar el assignedByUserId al método
                order.AssignToOperator(command.OperatorUserId, team, selectedZoneId.Value, assignedByUserId);
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
            // EF Core detectará automáticamente el nuevo DeliveryTeamAssignment y lo guardará
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
            await _publisher.PublishToExchangeAsync(integrationEvent, "order_assigned_delivery_exchange");

            _logger.LogInformation("✅ Evento OrderAssignDeliveryIntegrationEvent publicado para la orden {DepotOrderId}", order.DepotOrderId);

            return true;
        }
    }
}