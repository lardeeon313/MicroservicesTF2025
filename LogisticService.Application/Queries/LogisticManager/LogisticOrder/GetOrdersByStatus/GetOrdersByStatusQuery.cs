using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByStatus
{
    public class GetOrdersByStatusQuery
    {
        public OrderStatus Status { get; set; }

        public GetOrdersByStatusQuery(OrderStatus status)
        {
            Status = status;
        }
    }
}
