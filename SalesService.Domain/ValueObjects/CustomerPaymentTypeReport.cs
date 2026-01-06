using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.ValueObjects
{
    public class CustomerPaymentTypeReport
    {
        public Guid CustomerId { get; init; }
        public string FullName { get; init; } = default!;
        public string Address { get; init; } = default!;
        public List<PaymentType> PaymentTypes { get; init; } = new();
    }
}
