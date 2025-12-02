using DepotService.Application.DTOs;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Domain.Enums;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer
{
    public class GetInvoicedOrdersByCustomerQueryHandler
        : IGetInvoicedOrdersByCustomerQueryHandler
    {
        private readonly IDepotOrderRepository _repository;
        private readonly ILogger<GetInvoicedOrdersByCustomerQueryHandler> _logger;

        public GetInvoicedOrdersByCustomerQueryHandler(
            IDepotOrderRepository repository,
            ILogger<GetInvoicedOrdersByCustomerQueryHandler> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<List<DepotOrderDto>> GetInvoicedOrdersByCustomerAsync(
            GetInvoicedOrdersByCustomerQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.CustomerName))
                throw new ArgumentException("Debe especificar el nombre del cliente.");

            _logger.LogInformation("Searching invoiced orders for customer: {CustomerName}", query.CustomerName);

            var ordersByCustomer = await _repository.GetInvoicedOrdersByCustomerAsync(query.CustomerName);

            if (!ordersByCustomer.Any())
            {
                _logger.LogWarning("No invoiced orders found for customer {CustomerName}.", query.CustomerName);
                return new List<DepotOrderDto>();
            }

            _logger.LogInformation("Found {Count} invoiced orders for {CustomerName}.",
                ordersByCustomer.Count, query.CustomerName);

            // MAPEAMOS CON LOGS DETALLADOS
            var result = ordersByCustomer.Select(o =>
            {
                _logger.LogInformation(
                    "Processing Order {OrderId}: StatusHistoryCount={Count}",
                    o.DepotOrderId,
                    o.StatusHistory?.Count ?? 0
                );

                if (o.StatusHistory == null || !o.StatusHistory.Any())
                {
                    _logger.LogWarning(
                        "Order {OrderId} has NO status history. BillingDate will be NULL.",
                        o.DepotOrderId
                    );
                }

                // Buscar estado de facturación
                var invoicedHistory = o.StatusHistory?
                    .FirstOrDefault(h => h.NewStatus == OrderStatus.Invoiced);

                if (invoicedHistory == null)
                {
                    _logger.LogWarning(
                        "Order {OrderId} has NO 'Invoiced' status.",
                        o.DepotOrderId
                    );
                }
                else
                {
                    _logger.LogInformation(
                        "Order {OrderId} invoiced at {Date}.",
                        o.DepotOrderId,
                        invoicedHistory.ChangedAt
                    );
                }

                // Log de TODOS los estados
                if (o.StatusHistory != null && o.StatusHistory.Any())
                {
                    _logger.LogInformation(
                        "Order {OrderId} statuses: {Statuses}",
                        o.DepotOrderId,
                        string.Join(", ", o.StatusHistory.Select(h => h.NewStatus))
                    );
                }

                return new DepotOrderDto
                {
                    DepotOrderId = o.DepotOrderId,
                    SalesOrderId = o.SalesOrderId,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    BillingDate = invoicedHistory?.ChangedAt,

                    Address = o.DeliveryAddress == null ? null : new OrderAddressDto
                    {
                        Street = o.DeliveryAddress.Street,
                        Number = o.DeliveryAddress.Number,
                        Apartment = o.DeliveryAddress.Apartment,
                        City = o.DeliveryAddress.City,
                        Province = o.DeliveryAddress.Province,
                        Country = o.DeliveryAddress.Country,
                        PostalCode = o.DeliveryAddress.PostalCode,
                        Latitude = o.DeliveryAddress.Latitude,
                        Longitude = o.DeliveryAddress.Longitude,
                        FormattedAddress = o.DeliveryAddress.FormattedAddress
                    },

                    Items = o.Items.Select(i => new DepotOrderItemDto
                    {
                        Id = i.Id,
                        ProductBrand = i.ProductBrand,
                        ProductName = i.ProductName,
                        Packaging = i.PackagingType,
                        Quantity = i.Quantity,
                        Total = i.UnitPrice.HasValue ? i.UnitPrice.Value * i.Quantity : 0,
                    }).ToList(),

                    PhoneNumber = o.PhoneNumber,
                    DeliveryDetail = o.DeliveryDetail,
                    OrderDate = o.OrderDate,
                };
            }).ToList();

            _logger.LogInformation("Mapping complete. Returning {Count} items.", result.Count);

            return result;
        }
    }
}
