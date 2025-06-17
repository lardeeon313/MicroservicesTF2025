using DepotService.Application.Commands.DepotOperator.SentOrderToBilling;
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

namespace DepotService.Application.Commands.DepotOperator.UnMarkItemReady
{
    /// <summary>
    /// Handler for the command to unmark an item as ready in the depot.
    /// </summary>
    public class UnmarkItemReadyCommandHandler(IRabbitMQPublisher publisher, DepotDbContext context, IDepotOrderRepository repository, ILogger<SentToBillingCommandHandler> logger) : IUnmarkItemReadyCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<SentToBillingCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        public async Task<bool> UnmarkItemReady(UnmarkItemReadyCommand command)
        {
            var item = await _context.DepotOrderItems.FindAsync(command.OrderItemId);

            if (item == null)
            {
                _logger.LogError($"Item with ID {command.OrderItemId} not found.");
                return false;
            }

            item.IsReady = false;
            await _context.SaveChangesAsync();

            // Verificamos si la orden completa sigue estando lista o no 
            var order = await _repository.GetByIdAsync(item.DepotOrderEntityId);
            if (order == null)
            {
                _logger.LogError($"Order with ID {item.DepotOrderEntityId} not found.");
                return false;
            }

            // Si todos los items de la orden no están listos, actualizamos el estado de la orden
            if (order != null && order.Items.All(i => !i.IsReady))
            {
                order.Status = Domain.Enums.OrderStatus.InPreparation;
                await _repository.UpdateOrderAsync(order);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Order with ID {order.DepotOrderId} status updated to InPreparation.");


                // Publicamos un evento de integración para notificar que un item ha sido desmarcado como listo
                var integrationEvent = new OrderInPreparationIntegrationEvent
                {
                    SalesOrderId = order.SalesOrderId,
                    InPreparationTime = DateTime.UtcNow,
                };

                await _publisher.PublishAsync(integrationEvent, "order_in_preparation_queue");
                _logger.LogInformation($"OrderInPreparationIntegrationEvent published for SalesOrderId {order.SalesOrderId}.");
            }
            return true;
        }
    }
}
