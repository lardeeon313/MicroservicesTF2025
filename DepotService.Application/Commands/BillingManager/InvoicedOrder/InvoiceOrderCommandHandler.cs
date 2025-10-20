using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using DepotService.Infraestructure.Messaging.Publisher;
using DepotService.Infraestructure.Persistence.Repositories;
using Microsoft.Extensions.Logging;
using SharedKernel.IntegrationEvents.DepotEvents;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using SharedKernel.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.InvoicedOrder
{
    /// <summary>
    /// Handler for processing invoice orders.
    /// </summary>
    public class InvoiceOrderCommandHandler(IRabbitMQPublisher publisher, DepotDbContext context, IDepotOrderRepository repository, ILogger<InvoiceOrderCommandHandler> logger) : IInvoiceOrderCommandHandler
    {
        private readonly IRabbitMQPublisher _publisher = publisher ?? throw new ArgumentNullException(nameof(publisher));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<InvoiceOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        private const string ORDER_INVOICED_EXCHANGE = "order_invoiced_exchange";

        /// <summary>
        /// Handles the command to invoice an order.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>       
        public async Task<bool> HandleAsync(InvoiceOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);

            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.DepotOrderId);
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }

            if (order.Status != OrderStatus.SentToBilling)
            {
                _logger.LogWarning("Order with ID {OrderId} is not in the correct status to be invoiced.", command.DepotOrderId);
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in the correct status to be invoiced.");
            }

            // Validar que todos los items tengan precio
            if (order.Items.Any(i => i.UnitPrice == null || i.UnitPrice <= 0))
            {
                _logger.LogWarning("Order with ID {OrderId} has items without valid unit prices.", command.DepotOrderId);
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} has items without valid unit prices.");
            }

            var orderItems = order.Items.Select(i => new InvoicedItemDto
            {
                SalesOrderItemId = i.SalesOrderItemId,
                DepotOrderItemId = i.Id,
                ProductName = i.ProductName,
                ProductBrand = i.ProductBrand,
                PackagingType = i.PackagingType,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice ?? 0
            }).ToList();

            var totalAmount = orderItems.Sum(i => i.UnitPrice * i.Quantity);

            order.Status = OrderStatus.Invoiced;
            order.TotalAmount = totalAmount;
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order with ID {OrderId} has been successfully invoiced.", command.DepotOrderId);

            // Emitimos un evento de dominio para notificar que la orden ha sido facturada
            var integrationEvent = new OrderInvoicedIntegrationEvent
            {
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                CustomerId = order.CustomerId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                PaymentType = order.PaymentType.ToDto(),
                PhoneNumber = order.PhoneNumber,
                RegistrationDate = order.RegistrationDate,
                OrderDate = order.OrderDate,
                DeliveryDate = order.DeliveryDate,
                DeliveryDetail = order.DeliveryDetail,
                TotalAmount = totalAmount,
                InvoicedDate = DateTime.UtcNow,
                DeliveryAddress = new AddressDto
                {
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
                },
                OrderItems = orderItems
            };

            await _publisher.PublishToExchangeAsync(integrationEvent, ORDER_INVOICED_EXCHANGE);
            _logger.LogInformation("Order invoiced event published for order ID {OrderId}.", command.DepotOrderId);
            return true;
        }
    }
}
