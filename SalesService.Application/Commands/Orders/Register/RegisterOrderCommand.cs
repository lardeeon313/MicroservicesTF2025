using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.PaymentTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Register
{
    /// <summary>
    /// Comando para emitir un nuevo pedido
    /// </summary>
    public class RegisterOrderCommand
    {
        public Guid CustomerId { get; set; }
        public List<RegisterOrderItemRequest> Items { get; set; } = new();
        public string? DeliveryDetail { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string CreatedByUserId { get; set; } = string.Empty;
        public int? DeliveryAddressId { get; set; }
        public AddressRequest? DeliveryAddress { get; set; } = new();
        public PaymentType? PaymentType { get; set; }

        public RegisterOrderCommand(Guid customerId, List<RegisterOrderItemRequest> items, DateTime? deliverDate, string? deliveryDetail, string createdByUserId, AddressRequest? deliveryAddress, int? deliveryAddressId, PaymentType? paymentType)
        {
            CustomerId = customerId;
            DeliveryDetail = deliveryDetail;
            DeliveryDate = deliverDate;
            Items = items;
            CreatedByUserId = createdByUserId;
            DeliveryAddressId = deliveryAddressId;
            DeliveryAddress = deliveryAddress;
            PaymentType = paymentType;
        }

    }
}