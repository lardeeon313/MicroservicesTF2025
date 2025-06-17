using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.MarkItemReady
{
    public class MarkItemCommandHandler(IRabbitMQPublisher publisher,IDepotOrderRepository repository, DepotDbContext context, ILogger<MarkItemCommandHandler> logger) : IMarkItemCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<MarkItemCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para marcar un item de un pedido como listo en el Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> MarkItemHandler(MarkItemCommand command)
        {
            var item = await context.DepotOrderItems
                .Include(i => i.DepotOrderEntity)
                .FirstOrDefaultAsync(i => i.Id == command.OrderItemId);

            if (item == null)
            {
                _logger.LogError($"Item with ID {command.OrderItemId} not found.");
                throw new KeyNotFoundException($"Item with ID {command.OrderItemId} not found.");
            }

            if (item.DepotOrderEntity.AssignedOperatorId != command.OperatorUserId)
            {
                _logger.LogError($"Item with ID {command.OrderItemId} is not assigned to operator {command.OperatorUserId}.");
                throw new InvalidOperationException($"Item with ID {command.OrderItemId} is not assigned to operator {command.OperatorUserId}.");
            }

            item.IsReady = true;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Item with ID {command.OrderItemId} marked as ready by operator {command.OperatorUserId}.");


            // Verificamos si la orden ya esta totalmente preparada
            var allItemsReady = await _context.DepotOrderItems
                .Where(i => i.DepotOrderEntityId == item.DepotOrderEntityId)
                .AllAsync(i => i.IsReady);

            if (allItemsReady)
            {
                var order = item.DepotOrderEntity;
                order.Status = OrderStatus.Prepared; // Cambiamos el estado de la orden a "Preparada"
                await _repository.UpdateOrderAsync(order);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Order with ID {order.DepotOrderId} is now fully prepared.");

                var integrationEvent = new OrderPreparedIntegrationEvent
                {
                    SalesOrderId = order.SalesOrderId,
                    ReadyAt = DateTime.UtcNow,
                };

                // Publicamos el evento de orden preparada
                await _publisher.PublishAsync(integrationEvent, "order_prepared_queue");
                _logger.LogInformation($"Order prepared event published for order ID {order.DepotOrderId}.");
            }

            return true;
        }
    }
}
