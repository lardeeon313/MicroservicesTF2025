using DepotService.Domain.Common.Interfaces;
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
using DepotService.Domain.Entities;

namespace DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder
{
    public class ConfirmAssignedOrderCommandHandler(IEmailService emailService, IRabbitMQPublisher publisher, DepotDbContext context, IDepotOrderRepository repository, ILogger<ConfirmAssignedOrderCommandHandler> logger) : IConfirmAssignedOrderCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<ConfirmAssignedOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly IEmailService _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));

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

            var oldStatus = order.Status;

            // ⬅️ Esto cambia el estado a InPreparation
            order.ConfirmAssigment();

            var newStatus = order.Status;

            // 🟩 Registrar historial del cambio de estado
            var history = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,   // Ojo: en tu entidad se llama OrderId
                OldStatus = oldStatus,
                NewStatus = newStatus,
                ChangedAt = DateTime.UtcNow
            };

            _context.OrderStatusHistories.Add(history);

            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Order {command.DepotOrderId} moved to {order.Status} and history recorded.");

            // Publicamos evento para SalesService
            var integrationEvent = new OrderInPreparationIntegrationEvent
            {
                SalesOrderId = order.SalesOrderId,
                InPreparationTime = DateTime.UtcNow,
            };

            await _publisher.PublishAsync(integrationEvent, "order_in_preparation_queue");
            _logger.LogInformation($"OrderInPreparationIntegrationEvent published for SalesOrderId {order.SalesOrderId}.");

            // Enviamos notificación por correo electrónico
            var subject = "Tu pedido esta en Preparación";
            var htmlBody = EmailTemplateGenerator.Generate(
                subject,
                "Tu pedido esta en Preparación",
                order.CustomerName,
                $"Nos complace informarte que tu pedido con ID {order.DepotOrderId} ha sido confirmado y está en preparación por el operador de Depósito. Te notificaremos una vez que se complete la preparación. Gracias por tu preferencia."
            );

            await _emailService.SendEmailAsync(
                order.CustomerEmail,
                subject,
                htmlBody
            );

            _logger.LogInformation($"Email sent to {order.CustomerEmail} regarding order {order.DepotOrderId} confirmation.");

        }
    }
}
