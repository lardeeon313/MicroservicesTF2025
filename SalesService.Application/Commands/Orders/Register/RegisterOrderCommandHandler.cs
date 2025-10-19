using SalesService.Application.DTOs.Order;
using SalesService.Domain.Common.Interfaces;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Email.EmailTemplates;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Register
{
    /// <summary>
    /// Manejador para registrar nota de pedido
    /// </summary>
    public class RegisterOrderCommandHandler(
        IEmailService emailService,
        IOrderRepository orderRepository,
        IRabbitMQPublisher publisher,
        ICustomerRepository customerRepository
    ) : IRegisterOrderCommandHandler
    {
        private readonly IEmailService _emailService = emailService;
        private readonly IOrderRepository _orderRepository = orderRepository;
        private readonly IRabbitMQPublisher _publisher = publisher;
        private readonly ICustomerRepository _customerRepository = customerRepository;

        public async Task<OrderDto> HandleAsync(RegisterOrderCommand command)
        {
            // Verificar si el cliente existe
            var customer = await _customerRepository.GetByIdAsync(command.CustomerId)
                ?? throw new KeyNotFoundException($"Customer with ID {command.CustomerId} not found.");

            Address deliveryAddress;

            // Si el usuario seleccionó una dirección existente
            if (command.DeliveryAddress.Id > 0)
            {
                deliveryAddress = customer.Addresses?.FirstOrDefault(a => a.Id == command.DeliveryAddress.Id)
                    ?? throw new KeyNotFoundException($"Address with ID {command.DeliveryAddress.Id} not found for this customer.");
            }
            else
            {
                // Crear una nueva dirección manual
                deliveryAddress = new Address
                {
                    Street = command.DeliveryAddress.Street,
                    Number = command.DeliveryAddress.Number,
                    Apartment = command.DeliveryAddress.Apartment,
                    City = command.DeliveryAddress.City,
                    Province = command.DeliveryAddress.Province,
                    Country = command.DeliveryAddress.Country,
                    PostalCode = command.DeliveryAddress.PostalCode,
                    Latitude = command.DeliveryAddress.Latitude,
                    Longitude = command.DeliveryAddress.Longitude,
                    FormattedAddress = command.DeliveryAddress.FormattedAddress,
                    CustomerId = command.CustomerId
                };
            }

            Console.WriteLine($"Address antes de guardar: {deliveryAddress.Id}, {deliveryAddress.Street}, {deliveryAddress.Number}");

            // Crear la orden directamente con el Address
            var order = new Order
            {
                CustomerId = command.CustomerId,
                DeliveryDate = command.DeliveryDate,
                DeliveryDetail = command.DeliveryDetail,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                CreatedByUserId = command.CreatedByUserId,
                PaymentType = command.PaymentType,
                Items = command.Items.Select(i => new OrderItem
                {
                    ProductBrand = i.ProductBrand,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity
                }).ToList(),
                DeliveryAddress = deliveryAddress // 🔑 asignación directa
            };

            Console.WriteLine($"Order antes de guardar: {JsonSerializer.Serialize(order)}");

            // Guardar todo en la DB (EF hace el insert de Address y Order en la misma transacción)
            await _orderRepository.AddAsync(order);

            Console.WriteLine($"Order después de guardar: {JsonSerializer.Serialize(order)}");

            // Actualizar el estado del cliente a "Active"
            customer.Status = CustomerStatus.Active;
            await _customerRepository.UpdateAsync(customer);

            // Creamos el evento de integración
            var integrationEvent = new OrderRegisteredIntegrationEvent
            {
                OrderId = order.Id,
                CustomerId = order.CustomerId,
                OrderDate = order.OrderDate,
                Items = order.Items.Select(i => new OrderItemsDto
                {
                    ProductName = i.ProductName,
                    ProductBrand = i.ProductBrand,
                    Quantity = i.Quantity,
                }).ToList(),
            };

            // Publicar el evento en RabbitMQ
            await _publisher.PublishAsync(integrationEvent, "order_registered_queue");

            // Enviar un correo electrónico al cliente
            var htmlBody = EmailTemplateGenerator.BuildOrderRegisteredTemplate(
                customerName: $"{customer.FirstName} {customer.LastName}",
                orderId: order.Id,
                orderDate: order.OrderDate,
                deliveryDate: order.DeliveryDate,
                deliveryDetail: order.DeliveryDetail ?? " ",
                items: order.Items
            );

            await _emailService.SendEmailAsync(
                customer.Email,
                "Tu pedido fue registrado correctamente! - Verona",
                htmlBody
            );

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
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    ProductBrand = i.ProductBrand,
                    Quantity = i.Quantity
                }).ToList(),
                Address = new SalesService.Application.DTOs.Customer.AddressDto
                {
                    Id = order.DeliveryAddress.Id,
                    Street = order.DeliveryAddress.Street,
                    Number = order.DeliveryAddress.Number,
                    Apartment = order.DeliveryAddress.Apartment,
                    City = order.DeliveryAddress.City,
                    Province = order.DeliveryAddress.Province,
                    Country = order.DeliveryAddress.Country,
                    PostalCode = order.DeliveryAddress.PostalCode,
                    Latitude = order.DeliveryAddress.Latitude,
                    Longitude = order.DeliveryAddress.Longitude,
                    FormattedAddress = order.DeliveryAddress.FormattedAddress
                }
            };
        }
    }
}
