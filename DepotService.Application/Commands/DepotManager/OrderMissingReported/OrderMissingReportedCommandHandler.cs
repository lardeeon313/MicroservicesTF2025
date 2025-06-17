using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
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
        IRabbitMQPublisher rabbitMQ,
        IDepotOrderRepository repository,
        DepotDbContext context, 
        ILogger<OrderMissingReportedCommand> logger
        ) : IOrderMissingReportedCommandHandler
    {
        private readonly IRabbitMQPublisher _rabbitMQ = rabbitMQ;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<OrderMissingReportedCommand> _logger = logger;

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

            // Guardar los cambios en la base de datos
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

            // Retornar un mensaje de éxito
            return true;
        }

    }
}
