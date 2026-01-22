using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Reports
{
    public class CustomerPaymentTypeReportDto
    {
        public Guid CustomerId { get; set; }
        public string Customer { get; set; } = default!;
        public string Address { get; set; } = default!;
        public List<string> PaymentTypes { get; set; } = new();
    }
}
