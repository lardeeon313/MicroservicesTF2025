using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities;
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

            var existingOrder = await _orderRepository.GetByIdAsync(command.OrderId)
                ?? throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            // Se actualizan solo los campos modificables desde SalesService
            existingOrder.DeliveryDetail = command.Request.DeliveryDetail;
            existingOrder.ModifiedStatusDate = DateTime.UtcNow;
            existingOrder.PaymentType = command.Request.PaymentType;
            existingOrder.PaymentReceipt = command.Request.PaymentReceipt;
            existingOrder.Status = command.Request.Status;
            existingOrder.CreatedByUserId = command.Request.ModifiedByUserId ?? existingOrder.CreatedByUserId;

            if (command.Request.AddressRequest != null)
            {
                if (command.Request.AddressRequest.Id > 0)
                {
                    // Reutilizamos la dirección existente si pertenece al cliente
                    var existingAddress = existingOrder.Customer?.Addresses?
                        .FirstOrDefault(a => a.Id == command.Request.AddressRequest.Id);

                    if (existingAddress == null)
                        throw new KeyNotFoundException($"Address with ID {command.Request.AddressRequest.Id} not found for this customer.");

                    // Reutilizamos la dirección existente
                    existingOrder.DeliveryAddressId = existingAddress.Id;
                    existingOrder.DeliveryAddress = existingAddress;
                }
                else
                {
                    // Se registró una nueva dirección manual
                    var newAddress = new Address
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

                    existingOrder.DeliveryAddress = newAddress;
                    existingOrder.DeliveryAddressId = 0; // Se asignará al guardar
                }
            }

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
                }).ToList(),
            };


        }
    }
}
