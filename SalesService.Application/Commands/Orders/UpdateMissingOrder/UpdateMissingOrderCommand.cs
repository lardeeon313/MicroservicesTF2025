using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.UpdateMissingOrder
{
    public class UpdateMissingOrderCommand
    {
        public int OrderId { get; }
        public UpdateOrderMissingRequest Request { get; }


        public UpdateMissingOrderCommand(int orderId, UpdateOrderMissingRequest request)
        {
            OrderId = orderId;
            Request = request;
        }
    }
}
