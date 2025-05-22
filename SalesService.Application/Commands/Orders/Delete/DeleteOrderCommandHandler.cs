using SalesService.Application.IntegrationEvents.Order;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace SalesService.Application.Commands.Orders.Delete
{
    /// <summary>
    /// Manejador para eliminar un pedido
    /// </summary>
    /// <param name="orderRepository"></param>
    public class DeleteOrderCommandHandler(IOrderRepository orderRepository, IRabbitMQPublisher publisher) : IDeleteOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository = orderRepository;
        private readonly IRabbitMQPublisher _publisher = publisher;

        public async Task<bool> HandleAsync(DeleteOrderCommand command)
        {
            // Verificamos si la orden existe
            var orderExist = await _orderRepository.GetByIdAsync(command.Id);
            if (orderExist == null)
                throw new KeyNotFoundException($"Order with ID {command.Id} not found.");

            // Eliminamos la order de la base de datos
            await _orderRepository.DeleteAsync(orderExist);

            // Creamos el evento
            var integrationEvent = new OrderDeleteIntegrationEvent
            {
                OrderId = orderExist.Id,
                Reason = command.Reason,
            };

            // Publicamos el evento en RabbitMQ
            await _publisher.PublishAsync(integrationEvent, "order_deleted_queue");

            return true;
        }
    }
}
