using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.PaymentTypes;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;

namespace SharedKernel.IntegrationEvents.SalesEvents.Order
{
    public class OrderIssuedIntegrationEvent
    {
        public int OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;        
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentTypeDto? PaymentType { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? DeliveryDetail { get; set; }
        public List<OrderItemsDto> Items { get; set; } = [];
        public AddressDto? DeliveryAddress { get; set; } 
    }

}