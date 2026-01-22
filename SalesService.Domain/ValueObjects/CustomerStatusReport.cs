using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.ValueObjects
{
    public class CustomerStatusReport
    {
        public Guid CustomerId { get; init; }
        public string FullName { get; init; } = default!;
        public string Email { get; init; } = default!;
        public string? PhoneNumber { get; init; }

        public int OrderCount { get; init; }
        public CustomerStatus Status { get; init; }
    }
}
