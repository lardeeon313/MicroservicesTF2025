using SalesService.Application.DTOs.Order;
using SalesService.Application.IntegrationEvents.Order;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Register
{
    /// <summary>
    /// Manejador para registrar nota de pedido
    /// </summary>

    public class RegisterOrderCommandHandler(IOrderRepository orderRepository,IRabbitMQPublisher publisher, ICustomerRepository customerRepository ) : IRegisterOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository = orderRepository;
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly ICustomerRepository _customerRepository = customerRepository;
            
        public async Task<OrderDto> HandleAsync(RegisterOrderCommand command)
        {
            // Verificar si el cliente existe
            var customer = await _customerRepository.GetByIdAsync(command.CustomerId)
                ?? throw new KeyNotFoundException($"Customer with ID {command.CustomerId} not found.");

            // Crear la orden
            var order = new Order
            {
                CustomerId = command.CustomerId,
                DeliveryDate = command.DeliveryDate,
                DeliveryDetail = command.DeliveryDetail,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                CreatedByUserId = command.CreatedByUserId,
            };

            // Asignar los items a la orden
            order.Items = command.Items.Select(i => new OrderItem
            {
                ProductName = i.ProductName,
                ProductBrand = i.ProductBrand,
                Quantity = i.Quantity,
            }).ToList();



            // Guardar la orden en la base de datos
            await _orderRepository.AddAsync(order);

            // Actualizar el estado del cliente a "Active"
            customer.Status = CustomerStatus.Active;
            await _customerRepository.UpdateAsync(customer);

            // Creamos el evento
            var integrationEvent = new OrderRegisteredIntegrationEvent
            {
                OrderId = order.Id,
                CustomerId = order.CustomerId,
                OrderDate = order.OrderDate,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    ProductBrand = i.ProductBrand,
                    Quantity = i.Quantity,
                }).ToList(),
            };

            // Publicar el evento en RabbitMQ
            await _publisher.PublishAsync(integrationEvent, "order_registered_queue");


            // Devolver el DTO de la orden creada
            return new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                DeliveryDetail = order.DeliveryDetail,
                OrderDate = order.OrderDate,
                Status = order.Status,
                DeliveryDate = order.DeliveryDate,
                CreatedByUserId = order.CreatedByUserId,
            };
        }
    }
}
