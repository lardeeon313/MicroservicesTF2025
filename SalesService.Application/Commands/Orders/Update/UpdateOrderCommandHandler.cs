using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Application.Commands.Orders.Update
{
    public class UpdateOrderCommandHandler : IUpdateOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository;

        public UpdateOrderCommandHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderDto?> HandleAsync(UpdateOrderCommand command)
        {
            var existingOrder = await _orderRepository.GetByIdAsync(command.OrderId);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");
            }

            // Log: Estado inicial del pedido
            Console.WriteLine($"--- Estado inicial del pedido (ID: {existingOrder.Id}) ---");
            Console.WriteLine($"EL Total de productos antes de la actualización: {existingOrder.Items.Count}");
            foreach (var item in existingOrder.Items)
            {
                Console.WriteLine($"- Id: {item.Id}, Producto: {item.ProductName}, Cantidad: {item.Quantity}");
            }

            // Se actualizan solo los campos modificables desde SalesService
            existingOrder.DeliveryDetail = command.Request.DeliveryDetail;
            existingOrder.ModifiedStatusDate = DateTime.UtcNow;
            existingOrder.PaymentType = command.Request.PaymentType;
            existingOrder.PaymentReceipt = command.Request.PaymentReceipt;
            existingOrder.Status = command.Request.Status;
            existingOrder.CreatedByUserId = command.Request.ModifiedByUserId ?? existingOrder.CreatedByUserId;

            if (command.Request.AddressRequest != null)
            {
                // Reemplazamos la dirección completa
                existingOrder.DeliveryAddress = new Address
                {
                    Street = command.Request.AddressRequest.Street,
                    Number = command.Request.AddressRequest.Number,
                    Apartment = command.Request.AddressRequest.Apartment,
                    City = command.Request.AddressRequest.City,
                    Province = command.Request.AddressRequest.Province,
                    Country = command.Request.AddressRequest.Country,
                    PostalCode = command.Request.AddressRequest.PostalCode,
                    Latitude = command.Request.AddressRequest.Latitude,
                    Longitude = command.Request.AddressRequest.Longitude,
                    FormattedAddress = command.Request.AddressRequest.FormattedAddress,
                    CreatedAt = existingOrder.DeliveryAddress?.CreatedAt ?? DateTime.UtcNow
                };
            }

            // Actualizar Items
            foreach (var itemDto in command.Request.Items)
            {
                if (itemDto.Id == 0 || itemDto.Id == null)
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
                else
                {
                    // Actualizamos item existente
                    var existingItem = existingOrder.Items.FirstOrDefault(i => i.Id == itemDto.Id);
                    if (existingItem != null)
                    {
                        existingItem.ProductName = itemDto.ProductName ?? existingItem.ProductName;
                        existingItem.ProductBrand = itemDto.ProductBrand ?? existingItem.ProductBrand;
                        existingItem.Quantity = itemDto.Quantity;
                    }
                }
            }

            // Log: Estado del pedido después de procesar los productos
            Console.WriteLine($"\n--- Estado del pedido después de procesar los productos ---");
            Console.WriteLine($"Total de productos después de procesar: {existingOrder.Items.Count}");
            foreach (var item in existingOrder.Items)
            {
                Console.WriteLine($"- Id: {item.Id}, Producto: {item.ProductName}, Cantidad: {item.Quantity}");
            }

            // Guardar cambios en la base de datos
            Console.WriteLine("\nGuardando cambios en la base de datos...");

            await _orderRepository.UpdateAsync(existingOrder);

            // Log: Resultado final del pedido
            Console.WriteLine($"\n--- Resultado final del pedido (ID: {existingOrder.Id}) ---");
            Console.WriteLine($"Total de productos guardados: {existingOrder.Items.Count}");
            foreach (var item in existingOrder.Items)
            {
                Console.WriteLine($"- Id: {item.Id}, Producto: {item.ProductName}, Cantidad: {item.Quantity}");
            }

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
