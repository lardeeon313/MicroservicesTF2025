using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class OrderProcessingTime
    {
        public int OrderId { get; set; }
        public int DurationMinutes { get; set; }
    }
}
