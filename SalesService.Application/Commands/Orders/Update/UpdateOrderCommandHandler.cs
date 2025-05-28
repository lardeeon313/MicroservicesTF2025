using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Update
{
    public class UpdateOrderCommandHandler(IOrderRepository orderRepository) : IUpdateOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository = orderRepository;
        public async Task<OrderDto?> HandleAsync(UpdateOrderCommand command)
        {
            
            var existingOrder = await _orderRepository.GetByIdAsync(command.OrderId);

            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");
            }

            // Se actualizan solo los campos modificables desde SalesService
            existingOrder.DeliveryDetail = command.Request.DeliveryDetail;
            existingOrder.ModifiedStatusDate = DateTime.UtcNow;
            existingOrder.Status = command.Request.Status;
            existingOrder.CreatedByUserId = command.Request.ModifiedByUserId ?? existingOrder.CreatedByUserId;

            // Actualizar Items
            foreach (var itemDto in command.Request.Items)
            {
                var existingItem = existingOrder.Items.FirstOrDefault(i => i.Id == itemDto.Id);

                if (existingItem != null)
                {
                    // Actualizamos item existente
                    existingItem.ProductName = itemDto.ProductName ?? existingItem.ProductName;
                    existingItem.ProductBrand = itemDto.ProductBrand ?? existingItem.ProductBrand;
                    existingItem.Quantity = itemDto.Quantity;
                }
                else
                {   
                    // Agregamos nuevo item
                    var newItem = new OrderItem
                    {
                        ProductName = itemDto.ProductName!,
                        ProductBrand = itemDto.ProductBrand!,
                        Quantity = itemDto.Quantity,
                        Order = existingOrder,
                        OrderId = existingOrder.Id
                    };

                    existingOrder.Items.Add(newItem);
                }
            }

            await _orderRepository.UpdateAsync(existingOrder);

            return new OrderDto
            {
                Id = existingOrder.Id,
                CustomerId = existingOrder.CustomerId,
                DeliveryDetail = existingOrder.DeliveryDetail,
                OrderDate = existingOrder.OrderDate,
                ModifiedStatusDate = existingOrder.ModifiedStatusDate,
                Status = existingOrder.Status,
                Items = existingOrder.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductName = i.ProductName,
                    ProductBrand = i.ProductBrand,
                    Quantity = i.Quantity
                }).ToList()
            };


        }
    }
}
