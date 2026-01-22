using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Reports
{
    public class CustomerSatisfactionReportDto
    {
        public int OrderId { get; set; }
        public string Customer { get; set; } = default!;
        public string Email { get; set; } = default!;
        public int Score { get; set; }
        public string Level { get; set; } = default!;
        public DateTime Date { get; set; }
    }
}
