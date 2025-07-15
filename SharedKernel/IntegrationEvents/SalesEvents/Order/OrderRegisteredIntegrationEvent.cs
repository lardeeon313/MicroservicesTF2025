using SalesService.Domain.Entities.OrderEntity;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.SalesEvents.Order
{
    public class OrderRegisteredIntegrationEvent
    {
        public int OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemsDto> Items { get; set; } = [];
    }   
}
