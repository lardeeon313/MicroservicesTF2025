using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Reports
{
    public class CustomerStatusReportDto
    {
        public Guid CustomerId { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PhoneNumber { get; set; }

        public int OrderCount { get; set; }
        public string Status { get; set; } = default!;
    }
}
