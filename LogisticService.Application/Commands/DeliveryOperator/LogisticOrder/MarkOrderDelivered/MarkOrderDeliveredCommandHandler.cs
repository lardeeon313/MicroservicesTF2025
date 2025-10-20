using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.LogisticEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered
{
    public class MarkOrderDeliveredCommandHandler(IRabbitMQPublisher publisher ,ILogisticOrderRepository repository, ILogger<MarkOrderDeliveredCommandHandler> logger) : IMarkOrderDeliveredCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<MarkOrderDeliveredCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler para marcar un pedido como entregado por un operador de logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> MarkOrderDelivered(MarkOrderDeliveredCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", command.LogisticOrderId);
                return false;
            }

            if (order.Status != OrderStatus.OnTheWay)
            {
                _logger.LogWarning(
                    "Cannot mark order {OrderId} as delivered because it is not OnTheWay. Current status: {Status}",
                    order.Id,
                    order.Status
                );
                return false;
            }

            // Si el metodo de pago es efectivo, Cambiamos el estado a PendingCashVerification
            if (order.PaymentType == PaymentType.Cash)
            {
                //Actualiza OrderStatusHistory
                var statusHistory = new OrderStatusHistory
                {
                    OrderId = order.DepotOrderId,
                    OldStatus = order.Status,
                    NewStatus = OrderStatus.PendingCashVerification,
                    ChangedAt = DateTime.UtcNow,
                };
                await _repository.AddStatusHistoryAsync(statusHistory);
                order.Status = OrderStatus.PendingCashVerification;
            }
            else
            {
                //Actualiza OrderStatusHistory
                var statusHistory = new OrderStatusHistory
                {
                    OrderId = order.DepotOrderId,
                    OldStatus = order.Status,
                    NewStatus = OrderStatus.Delivered,
                    ChangedAt = DateTime.UtcNow,
                };
                await _repository.AddStatusHistoryAsync(statusHistory);
                order.Status = OrderStatus.Delivered;
            }

            _logger.LogInformation("Order with ID {OrderId} marked as delivered by operator", command.LogisticOrderId);
            await _repository.UpdateAsync(order);

            var integrationEvent = new OrderDeliveredIntegrationEvent
            {
                LogisticOrderId = order.Id,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                DeliveredAt = DateTime.UtcNow,
            };

            // Emitir evento para notificar el cambio de estado.
            await _publisher.PublishToExchangeAsync(integrationEvent, "order_delivered_exchange");

            return true;
        }
    }
}
