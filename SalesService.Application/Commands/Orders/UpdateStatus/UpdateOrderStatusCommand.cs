using SalesService.Application.DTOs.Order.Request;
using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.UpdateStatus
{
    public class UpdateOrderStatusCommand
    {
        public int OrderId { get; set; }    
        public UpdateOrderStatusRequest Request { get; set; }

        public UpdateOrderStatusCommand(int orderId, UpdateOrderStatusRequest request)
        {
            OrderId = orderId;
            Request = request;
        }
    }
}
