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
        public string CustomerName { get; set; } = null!;
        public Guid? OperatorId { get; set; }

        public DateTime StartPreparation { get; set; }
        public DateTime Prepared { get; set; }
        public int DurationMinutes { get; set; }
    }
}
