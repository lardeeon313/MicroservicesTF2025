using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
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

        public RegisterOrderCommand(Guid customerId, List<RegisterOrderItemRequest> items,DateTime? deliverDate, string? deliveryDetail, string createdByUserId)
        {
            CustomerId = customerId;
            DeliveryDetail = deliveryDetail;
            DeliveryDate = deliverDate;
            Items = items;
            CreatedByUserId = createdByUserId;
        }
            
    }
}
