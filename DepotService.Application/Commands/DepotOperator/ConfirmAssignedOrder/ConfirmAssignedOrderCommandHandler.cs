using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder
{
    public class ConfirmAssignedOrderCommandHandler(IRabbitMQPublisher publisher, DepotDbContext context, IDepotOrderRepository repository, ILogger<ConfirmAssignedOrderCommandHandler> logger) : IConfirmAssignedOrderCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<ConfirmAssignedOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler para confirmar un pedido asignado a un operador en el Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task HandleAsync(ConfirmAssignedOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} not found.");
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }

            if (order.AssignedOperatorId != command.OperatorUserId)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not assigned to operator {command.OperatorUserId}.");
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not assigned to operator {command.OperatorUserId}.");
            }

            order.ConfirmAssigment(); // Esto cambia el estado de la orden a "En progreso".

            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been confirmed by operator {command.OperatorUserId}.");

            // Publicamos evento para SalesService
            var integrationEvent = new OrderInPreparationIntegrationEvent
            {
                SalesOrderId = order.SalesOrderId,
                InPreparationTime = DateTime.UtcNow,
            };

            await _publisher.PublishAsync(integrationEvent, "order_in_preparation_queue");
            _logger.LogInformation($"OrderInPreparationIntegrationEvent published for SalesOrderId {order.SalesOrderId}.");

        }
    }
}
