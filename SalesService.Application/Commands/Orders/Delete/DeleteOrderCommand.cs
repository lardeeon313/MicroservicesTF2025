using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Delete
{
    public class DeleteOrderCommand(int id,string reason)
    {
        public int Id { get; set; } = id;
        public string? Reason { get; set; } = reason;
    }
}
