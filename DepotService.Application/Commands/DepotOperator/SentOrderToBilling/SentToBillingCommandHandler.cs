using DepotService.Domain.Common.Interfaces;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Email.EmailTemplates;
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
    public class SentToBillingCommandHandler(IEmailService emailService, IRabbitMQPublisher publisher ,DepotDbContext context, IDepotOrderRepository repository, ILogger<SentToBillingCommandHandler> logger) : ISentToBillingCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<SentToBillingCommandHandler> _logger = logger;
        private readonly IEmailService _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));

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

            if (order.Status != OrderStatus.Prepared)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not in preparation status.");
                return false;
            }

            order.Status = OrderStatus.SentToBilling;
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been sent to billing successfully.");

            // Agregar el historial de estado a la base de datos
            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                OldStatus = order.Status,
                NewStatus = OrderStatus.SentToBilling,
                ChangedAt = DateTime.UtcNow,
            };
            await _context.OrderStatusHistories.AddAsync(statusHistory);
            await _context.SaveChangesAsync();

            var integrationEvent = new OrderSentToBillingIntegrationEvent
            {
                SalesOrderId = order.SalesOrderId,
                SentToBillingAt = DateTime.UtcNow,
            };

            // Publish the integration event to the billing queue
            await _publisher.PublishAsync(integrationEvent, "order_sent_billing_queue");
            _logger.LogInformation($"Order with ID {command.DepotOrderId} has been published to billing queue successfully.");

            // Send email notification
            var subjetc = "Tu pedido ha sido enviado a facturación";
            var htmlBody = EmailTemplateGenerator.Generate(
                subjetc,
                "Tu pedido ha sido enviado a facturación",
                order.CustomerName,
                $"Nos complace informarte que tu pedido con ID {order.DepotOrderId} ha sido enviado a facturación. Te notificaremos una vez que se procese la factura. Gracias por tu preferencia."
            );

            await _emailService.SendEmailAsync(
                order.CustomerEmail,
                subjetc,
                htmlBody
            );

            return true;
        }
    }
}
