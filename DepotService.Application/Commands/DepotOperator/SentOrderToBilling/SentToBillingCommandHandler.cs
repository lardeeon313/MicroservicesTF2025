using DepotService.Domain.Enums;
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

namespace DepotService.Application.Commands.DepotOperator.SentOrderToBilling
{
    public class SentToBillingCommandHandler(IRabbitMQPublisher publisher ,DepotDbContext context, IDepotOrderRepository repository, ILogger<SentToBillingCommandHandler> logger) : ISentToBillingCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<SentToBillingCommandHandler> _logger = logger;

        /// <summary>
        /// handler para enviar una orden a facturación en el servicio de depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> SentToBillingAsync(SentOrderToBillingCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} not found.");
                return false;
            }
            if (order.Status != OrderStatus.InPreparation)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not in preparation status.");
                return false;
            }

            order.Status = OrderStatus.SentToBilling;
            await _repository.UpdateOrderAsync(order);
            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been sent to billing successfully.");
            await _context.SaveChangesAsync();

            var integrationEvent = new OrderSentToBillingIntegrationEvent
            {
                SalesOrderId = order.SalesOrderId,
                SentToBillingAt = DateTime.UtcNow,
            };

            // Publish the integration event to the billing queue
            await _publisher.PublishAsync(integrationEvent, "order_sent_billing_queue");
            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been published to billing queue successfully.");

            return true;
        }
    }
}
