using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Domain.Entities.OrderEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.OrderReissued
{
    public class OrderReissuedCommand
    {
        public int SalesOrderId { get; set; }
        public List<UpdateOrderItemRequest> UpdateItems { get; set; } = [];
        public string DescriptionResolution { get; set; } = string.Empty;
    }
}
