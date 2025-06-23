using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.UpdateStatus
{
    public class UpdateOrderStatusCommandHandler(IOrderRepository repository, IRabbitMQPublisher publisher) : IUpdateOrderStatusCommandHandler
    {
        private readonly IOrderRepository _repository = repository;
        private readonly IRabbitMQPublisher _publisher = publisher;
        public async Task<bool> HandleAsync(UpdateOrderStatusCommand command)
        {
            var existingOrder = await _repository.GetByIdAsync(command.OrderId);
            if (existingOrder is null)
                throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            // Validamos que unicamente sea pending y que no tenga otro estado.
            if (existingOrder.Status != OrderStatus.Pending && existingOrder.Status != OrderStatus.Canceled)
            {
                throw new InvalidOperationException("Solo se puede modificar el estado si está en 'Pending'.");
            }

            if (command.Request.Status != OrderStatus.Issued &&
                command.Request.Status != OrderStatus.Canceled)
            {
                throw new InvalidOperationException("SalesService solo puede cambiar a 'Issued' o 'Canceled'.");
            }

            // Actualizamos el Status de la orden
            existingOrder.Status = command.Request.Status;
            existingOrder.ModifiedStatusDate = DateTime.UtcNow;
            existingOrder.CreatedByUserId = command.Request.ModifiedByUserId ?? existingOrder.CreatedByUserId;


            await _repository.UpdateAsync(existingOrder);

            
            if (command.Request.Status == OrderStatus.Issued)
            {
                // Creamos el evento de integración para la orden emitida
                var integrationEvent = new OrderIssuedIntegrationEvent
                {
                    OrderId = existingOrder.Id,
                    CustomerId = existingOrder.CustomerId,
                    CustomerName = existingOrder.Customer.FirstName + " " + existingOrder.Customer.LastName,
                    CustomerEmail = existingOrder.Customer.Email,
                    PhoneNumber = existingOrder.Customer.PhoneNumber,
                    DeliveryDetail = existingOrder.DeliveryDetail,
                    OrderDate = existingOrder.OrderDate,
                    Status = existingOrder.Status,
                    Items = existingOrder.Items.Select(i => new OrderItemsDto
                    {
                        Id = i.Id,
                        OrderId = existingOrder.Id,
                        ProductBrand = i.ProductBrand,
                        ProductName = i.ProductName,
                        Quantity = i.Quantity
                    }).ToList()
                };

                // Publicamos el evento en RabbitMQ
                await _publisher.PublishAsync(integrationEvent, "order_issued_queue");
            }

            return true;
        }
    }
}
