using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.InvoicedOrder
{
    /// <summary>
    /// Handler for processing invoice orders.
    /// </summary>
    public class InvoiceOrderCommandHandler(IRabbitMQPublisher publisher, DepotDbContext context, IDepotOrderRepository repository, ILogger<InvoiceOrderCommandHandler> logger) : IInvoiceOrderCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<InvoiceOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handles the command to invoice an order.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(InvoiceOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);

            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.DepotOrderId);
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }

            if (order.Status != OrderStatus.SentToBilling)
            {
                _logger.LogWarning("Order with ID {OrderId} is not in the correct status to be invoiced.", command.DepotOrderId);
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in the correct status to be invoiced.");
            }

            // Validar que todos los items tengan precio
            if (order.Items.Any(i => i.UnitPrice == null || i.UnitPrice <= 0))
            {
                _logger.LogWarning("Order with ID {OrderId} has items without valid unit prices.", command.DepotOrderId);
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} has items without valid unit prices.");
            }

            var orderItems = order.Items.Select(i => new InvoicedItemDto
            {
                OrderItemId = i.SalesOrderItemId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice ?? 0
            }).ToList();

            var totalAmount = orderItems.Sum(i => i.UnitPrice * i.Quantity);

            order.Status = OrderStatus.Invoiced;
            order.TotalAmount = totalAmount;
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order with ID {OrderId} has been successfully invoiced.", command.DepotOrderId);

            // Emitimos un evento de dominio para notificar que la orden ha sido facturada
            var integrationEvent = new OrderInvoicedIntegrationEvent
            {
                SalesOrderId = order.SalesOrderId,
                CustomerId = order.CustomerId,
                OrderItems = orderItems,
                TotalAmount = totalAmount,
                InvoicedDate = DateTime.UtcNow
            };

            await _publisher.PublishAsync(integrationEvent, "order_invoiced_queue");
            _logger.LogInformation("Order invoiced event published for order ID {OrderId}.", command.DepotOrderId);
            return true;
        }
    }
}
