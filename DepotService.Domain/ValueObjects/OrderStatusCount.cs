using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class OrderStatusCount
    {
        public string Status { get; set; } = string.Empty!;
        public int Count { get; set; }
    }
}
