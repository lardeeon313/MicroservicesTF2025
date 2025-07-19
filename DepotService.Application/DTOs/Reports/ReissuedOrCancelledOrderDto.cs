using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class ReissuedOrCancelledOrderDto
    {
        public int OrderId { get; set; }
        public DateTime? ReissuedAt { get; set; }
        public string? MissingReason { get; set; }
        public string? CurrentStatus { get; set; }
    }
}
