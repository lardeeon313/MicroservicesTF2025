using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Reports
{
    public class SalesPerformanceReportDto
    {
        public string SalespersonName { get; set; } = default!;
        public int TotalOrders { get; set; }
        public int TotalUnitsSold { get; set; }
        public DateTime? LastOrderDate { get; set; }
    }
}
