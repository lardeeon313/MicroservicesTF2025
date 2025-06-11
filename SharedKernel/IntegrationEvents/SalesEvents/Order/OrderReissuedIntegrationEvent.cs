using SalesService.Domain.Entities.OrderEntity;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.SalesEvents.Order
{
    public class OrderReissuedIntegrationEvent
    {
        public int SalesOrderId { get; set; }
        public int DepotOrderId { get; set; }
        public string ResolutionDescription { get; set; } = string.Empty;
        public List<OrderItemsDto> UpdateItems { get; set; } = [];
        public DateTime ReissuedAt { get; set; } = DateTime.UtcNow;
    }
}
