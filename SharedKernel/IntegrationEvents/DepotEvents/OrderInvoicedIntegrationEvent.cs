using DepotService.Domain.Enums;
using SalesService.Domain.Entities.CustomerEntity;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs;
using SharedKernel.IntegrationEvents.PaymentTypes;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderInvoicedIntegrationEvent
    {
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public PaymentTypeDto? PaymentType { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? DeliveryDetail { get; set; }

        public decimal TotalAmount { get; set; }
        public DateTime InvoicedDate { get; set; }

        public AddressDto DeliveryAddress { get; set; } = null!;
        public List<InvoicedItemDto> OrderItems { get; set; } = new();
    }
}
