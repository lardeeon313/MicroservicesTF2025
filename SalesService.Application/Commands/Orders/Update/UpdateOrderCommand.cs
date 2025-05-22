using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Update
{
    public class UpdateOrderCommand
    {
        public int OrderId { get; }
        public UpdateOrderRequest Request { get; }

        public UpdateOrderCommand(int orderId, UpdateOrderRequest request)
        {
            OrderId = orderId;
            Request = request;
        }
    }
}
