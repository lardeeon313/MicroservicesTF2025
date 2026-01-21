using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Update
{
    public class UpdateOrderCommandHandler(IOrderRepository orderRepository) : IUpdateOrderCommandHandler
    {
        private readonly IOrderRepository _orderRepository = orderRepository;

        public async Task<OrderDto?> HandleAsync(UpdateOrderCommand command)
        {
            var existingOrder = await _orderRepository.GetByIdAsync(command.OrderId)
                ?? throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            Console.WriteLine($"[UPDATE ORDER] OrderId: {existingOrder.Id}");
            Console.WriteLine($"[DB] Items actuales: {existingOrder.Items.Count}");

            // ============================
            // Actualización de datos simples
            // ============================
            existingOrder.DeliveryDetail = command.Request.DeliveryDetail;
            existingOrder.ModifiedStatusDate = DateTime.UtcNow;
            existingOrder.PaymentType = command.Request.PaymentType;
            existingOrder.PaymentReceipt = command.Request.PaymentReceipt;
            existingOrder.Status = command.Request.Status;
            existingOrder.CreatedByUserId =
                command.Request.ModifiedByUserId ?? existingOrder.CreatedByUserId;

            // ============================
            // Dirección
            // ============================
            if (command.Request.AddressRequest != null)
            {
                if (command.Request.AddressRequest.Id > 0)
                {
                    var existingAddress = existingOrder.Customer?.Addresses?
                        .FirstOrDefault(a => a.Id == command.Request.AddressRequest.Id)
                        ?? throw new KeyNotFoundException(
                            $"Address with ID {command.Request.AddressRequest.Id} not found for this customer.");

                    existingOrder.DeliveryAddressId = existingAddress.Id;
                    existingOrder.DeliveryAddress = existingAddress;
                }
                else
                {
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
                        CustomerId = existingOrder.CustomerId
                    };

                    existingOrder.DeliveryAddressId = 0;
                }
            }

            // ============================
            // ITEMS – SINCRONIZACIÓN REAL
            // ============================
            Console.WriteLine($"[REQUEST] Items recibidos: {command.Request.Items.Count}");

            var requestItemIds = command.Request.Items
                .Where(i => i.Id > 0)
                .Select(i => i.Id)
                .ToHashSet();

            // 🗑 Eliminar items que ya no vienen en el request
            var itemsToRemove = existingOrder.Items
                .Where(dbItem => !requestItemIds.Contains(dbItem.Id))
                .ToList();

            foreach (var item in itemsToRemove)
            {
                Console.WriteLine($"[REMOVE ITEM] Id: {item.Id}, Product: {item.ProductName}");
                existingOrder.Items.Remove(item);
            }

            // ✏️ Update / ➕ Add
            foreach (var itemDto in command.Request.Items)
            {
                OrderItem? existingItem = null;

                if (itemDto.Id > 0)
                {
                    existingItem = existingOrder.Items
                        .FirstOrDefault(i => i.Id == itemDto.Id);
                }

                if (existingItem != null)
                {
                    Console.WriteLine($"[UPDATE ITEM] Id: {existingItem.Id}");

                    existingItem.ProductName = itemDto.ProductName ?? existingItem.ProductName;
                    existingItem.ProductBrand = itemDto.ProductBrand ?? existingItem.ProductBrand;
                    existingItem.Quantity = itemDto.Quantity;
                }
                else
                {
                    Console.WriteLine($"[ADD ITEM] Nuevo producto: {itemDto.ProductName}");

                    existingOrder.Items.Add(new OrderItem
                    {
                        ProductName = itemDto.ProductName!,
                        ProductBrand = itemDto.ProductBrand!,
                        Quantity = itemDto.Quantity,
                        OrderId = existingOrder.Id
                    });
                }
            }

            Console.WriteLine($"[FINAL] Items antes de guardar: {existingOrder.Items.Count}");

            // ============================
            // Guardar cambios
            // ============================
            await _orderRepository.UpdateAsync(existingOrder);

            // ============================
            // Response
            // ============================
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
