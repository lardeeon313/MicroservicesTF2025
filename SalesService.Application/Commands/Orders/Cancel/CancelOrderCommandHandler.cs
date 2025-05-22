using SalesService.Application.DTOs.Order;
using SalesService.Application.IntegrationEvents.Order;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Cancel
{
    /// <summary>
    /// Manejador para cancelar un pedido
    /// </summary>
    public class CancelOrderCommandHandler(IOrderRepository orderRepository, IRabbitMQPublisher publisher) : ICancelOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository = orderRepository;
        private readonly IRabbitMQPublisher _publisher = publisher;
        public async Task<bool> Handle(CancelOrderCommand command)
        {
            // Verificamos si la orden existe
            var orderExist = await _orderRepository.GetByIdAsync(command.Id);
            if (orderExist == null)
                throw new KeyNotFoundException($"Order with ID {command.Id} not found.");

            // Validamos para cambiar el estado
            if (orderExist.Status == OrderStatus.Issued)
                throw new InvalidOperationException("No se puede cancelar una orden que ya ha sido emitida.");

            // Cambiamos el estado de la orden a cancelada
            orderExist.Status = Domain.Enums.OrderStatus.Canceled;

            // Guardamos los cambios en la base de datos    
            await _orderRepository.UpdateAsync(orderExist);

            // Creamos el evento
            var IntegrationEvent = new OrderCanceledIntegrationEvent
            {
                OrderId = orderExist.Id,
                Reason = command.Reason,
            };
            // Publicamos el evento en la cola de RabbitMQ
            await _publisher.PublishAsync(IntegrationEvent,"order_canceled_queue");

            return true;
        }
    }
}
