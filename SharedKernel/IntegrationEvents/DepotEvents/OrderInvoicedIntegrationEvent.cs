using SalesService.Domain.Entities.CustomerEntity;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderInvoicedIntegrationEvent
    {
        public int SalesOrderId { get; set; }
        public Guid CustomerId { get; set; }
        public List<InvoicedItemDto> OrderItems { get; set; } = new List<InvoicedItemDto>();
        public decimal TotalAmount { get; set; }
        public DateTime InvoicedDate { get; set; } = DateTime.UtcNow;
    }
}
