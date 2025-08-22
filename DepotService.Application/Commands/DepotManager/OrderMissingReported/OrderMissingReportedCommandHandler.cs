using DepotService.Domain.Common.Interfaces;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Email.EmailTemplates;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.OrderMissingReported
{
    public class OrderMissingReportedCommandHandler(
        IEmailService emailService,
        IRabbitMQPublisher rabbitMQ,
        IDepotOrderRepository repository,
        DepotDbContext context, 
        ILogger<OrderMissingReportedCommandHandler> logger
        ) : IOrderMissingReportedCommandHandler
    {
        private readonly IEmailService _emailService = emailService;
        private readonly IRabbitMQPublisher _rabbitMQ = rabbitMQ;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<OrderMissingReportedCommandHandler> _logger = logger;

        /// <summary>
        /// Manejador para el comando OrderMissingReportedCommand.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> OrderMissingHandle(OrderMissingReportedCommand command)
        {
            var depotOrder = await _repository.GetByIdAsync(command.DepotOrderId);
            if (depotOrder == null)
            {
                _logger.LogError($"Depot order with ID {command.DepotOrderId} not found.");
                return false;
            }

            depotOrder.Status = OrderStatus.PendingResolution;
            await _repository.UpdateOrderAsync(depotOrder);

            var statusHistory = new OrderStatusHistory
            {
                OrderId = depotOrder.DepotOrderId,
                OldStatus = depotOrder.Status,
                NewStatus = OrderStatus.PendingResolution,
                ChangedAt = DateTime.UtcNow,
            };

            // Agregar el historial de estado a la base de datos
            await _context.OrderStatusHistories.AddAsync(statusHistory);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Depot order with ID {command.DepotOrderId} status updated to PendingResolution.");

            // Antes de crear el DepotOrderMissing, validar si ya existe
            var existingMissing = await _context.DepotOrderMissings
                .FirstOrDefaultAsync(m => m.DepotOrderId == command.DepotOrderId);

            if (existingMissing == null)
            {
                var orderMissing = new DepotOrderMissing
                {
                    DepotOrderId = command.DepotOrderId,
                    MissingReason = command.MissingReason,
                    MissingDescription = command.MissingDescription,
                    MissingItems = command.MissingItems.Select(item => new DepotOrderMissingItem
                    {
                        MissingQuantity = item.Quantity,
                        ProductBrand = item.ProductBrand,
                        ProductName = item.ProductName,
                        Packaging = item.Packaging,
                        DepotOrderItemId = item.OrderItemId,
                    }).ToList(),
                };

                await _repository.AddMissingOrderAsync(orderMissing);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Depot order with ID {command.DepotOrderId} missing order created.");
            }
            else
            {
                _logger.LogInformation($"Depot order with ID {command.DepotOrderId} already has a missing order. Skipping creation.");
            }


            _logger.LogInformation($"Depot order with ID {command.DepotOrderId} status updated to PendingResolution.");

            var integrationEvent = new OrderMissingReportedIntegrationEvent
            {
                SalesOrderId = depotOrder.SalesOrderId,
                MissingReason = command.MissingReason,
                MissingDescription = command.MissingDescription,
                ReportedAt = DateTime.UtcNow,
                MissingItems = command.MissingItems.Select(item => new MissingItemDto
                {
                    OrderItemId = item.OrderItemId,
                    Quantity = item.Quantity,
                    ProductBrand = item.ProductBrand,
                    ProductName = item.ProductName,
                }).ToList(),
            };

            // Publicar el evento de orden faltante
            await _rabbitMQ.PublishAsync(integrationEvent, "order_missing_reported_queue");
            _logger.LogInformation($"Order missing reported successfully for DepotOrderId: {command.DepotOrderId}.");

            // Enviar notificación por correo electrónico 
            var subject = "Notificacion sobre tu pedido - Productos faltantes reportados";
            var htmlBody = EmailTemplateGenerator.Generate(
                subject,
                "Productos faltantes reportados",
                depotOrder.CustomerName,
                $"""
                Detectamos un inconveniente con tu pedido <strong>#{depotOrder.DepotOrderId}</strong>. Uno o más productos presentan faltantes.
                <br><br>
                <strong>Motivo:</strong> {command.MissingReason}<br>
                <strong>Descripción:</strong> {command.MissingDescription}
                <br><br>
                Nuestro equipo ya está trabajando para resolverlo lo antes posible. Nos estaremos comunicando para informarte sobre la resolución.
                """
            );

            await _emailService.SendEmailAsync(
                depotOrder.CustomerEmail,
                subject,
                htmlBody
            );
            _logger.LogInformation($"Email sent to {depotOrder.CustomerEmail} regarding missing items in order {depotOrder.DepotOrderId}.");

            // Retornar un mensaje de éxito
            return true;
        }

    }
}
