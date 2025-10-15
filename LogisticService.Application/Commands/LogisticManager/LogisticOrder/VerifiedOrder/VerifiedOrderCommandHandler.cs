using LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using LogisticService.Infraestructure.Messaging.Publisher;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents;
using SharedKernel.IntegrationEvents.LogisticEvents;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using SharedKernel.IntegrationEvents.SalesEvents.Order;

namespace LogisticService.API.RequestDtos.LogisticOrders
{
    public class VerifiedOrderCommandHandler(IRabbitMQPublisher publisher, ILogisticOrderRepository repository, ILogger<VerifiedOrderCommandHandler> logger) : IVerifiedOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<VerifiedOrderCommandHandler> _logger = logger;
        private readonly IRabbitMQPublisher _publisher = publisher;

        /// <summary>
        /// Handler para verificar un pedido en el sistema de gestión logística.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> VerifiedOrderHandleAsync(VerifiedOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("No se encontró la orden logística con ID: {LogisticOrderId}", command.LogisticOrderId);
                return false;
            }

            order.Status = OrderStatus.Verified;
            await _repository.UpdateAsync(order);

            // Emitimos evento para notificar a DepotService y SalesService que la orden ha sido verificada.
            try
            {
                if (order.Status == OrderStatus.Verified)
                {
                    // Creamos el evento de integración para la orden emitida
                    var integrationEvent = new OrderVerifyIntegrationEvent
                    {
                        SalesOrderId = order.SalesOrderId,
                        DepotOrderId = order.DepotOrderId,
                        LogisticOrderId = order.Id,
                        VerifyAt = DateTime.UtcNow
                    };

                    _logger.BeginScope(new Dictionary<string, object>
                    {
                        ["LogisticOrderId"] = order.Id,
                        ["SalesOrderId"] = order.SalesOrderId,
                        ["DepotOrderId"] = order.DepotOrderId
                    });

                    // Publicamos el evento en RabbitMQ
                    await _publisher.PublishAsync(integrationEvent, "order_verified_queue");
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores al publicar el evento
                throw new InvalidOperationException("Error al publicar el evento de orden verificada.", ex);
            }


            _logger.LogInformation("La orden logística con ID: {LogisticOrderId} ha sido verificada.", command.LogisticOrderId);
            return true;


        }
    }
}
