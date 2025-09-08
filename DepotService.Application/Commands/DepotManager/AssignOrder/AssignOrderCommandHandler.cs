using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOrder
{
    public class AssignOrderCommandHandler(IRabbitMQPublisher publisher,IDepotOrderRepository repository, ITeamRepository teamRepository, DepotDbContext context, ILogger<AssignOrderCommandHandler> logger) : IAssignOrderCommandHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ITeamRepository _teamRepository = teamRepository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<AssignOrderCommandHandler> _logger = logger;
        private readonly IRabbitMQPublisher _publisher = publisher;

        public async Task HandleAsync(AssignOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");

            // Buscar el equipo en base al operador
            var team = await _teamRepository.GetTeamByOperatorAsync(command.OperatorUserId);

            if (team == null)
                throw new InvalidOperationException("El operador no está asignado a ningún equipo.");

            if (order.Status != OrderStatus.Assigned)
            {
                var statusHistory = new OrderStatusHistory
                {
                    OrderId = order.DepotOrderId,
                    OldStatus = order.Status,
                    NewStatus = OrderStatus.Assigned,
                    ChangedAt = DateTime.UtcNow,
                };

                await _context.OrderStatusHistories.AddAsync(statusHistory);
                await _context.SaveChangesAsync();
            }

            // ✅ asignar operador + equipo encontrado
            order.AssignToOperator(command.OperatorUserId, team);


            await _context.SaveChangesAsync();
            _logger.LogInformation("✅ Orden {Id} asignada al operador {Operator}", order.DepotOrderId, order.AssignedOperatorId);

            var integrationEvent = new OrderConfirmedIntegrationEvent
            {
                DepotOrderId = command.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                ConfirmedAt = DateTime.UtcNow,
            };

            // Publicar el evento de orden confirmada
            await _publisher.PublishAsync(integrationEvent, "order_confirmed_queue");

            _logger.LogInformation("✅ Evento OrderConfirmedIntegrationEvent publicado para la orden {DepotOrderId}", command.DepotOrderId);
        }
    }
}
