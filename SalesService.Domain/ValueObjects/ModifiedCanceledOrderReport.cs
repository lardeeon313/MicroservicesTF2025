using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.ValueObjects
{
    public class ModifiedCanceledOrderReport
    {
        public int OrderId { get; set; }
        public string CustomerFullName { get; set; } = default!;
        public DateTime OrderDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public OrderStatus Status { get; set; }
    }
}
