using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Delete
{
    public class DeleteOrderCommand
    {
        public int Id { get; set; }
        public string? Reason { get; set; }

        public DeleteOrderCommand(DeleteOrderRequest request)
        {
            Id = request.OrderId;
            Reason = request.reason;
        }

        public DeleteOrderCommand(int id, string reason)
        {
            Id = id;
            Reason = reason;
        }
    }
}
