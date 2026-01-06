using SalesService.Domain.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.ValueObjects
{
    public class CustomerSatisfactionReport
    {
        public int OrderId { get; init; }
        public Guid CustomerId { get; init; }
        public string FullName { get; init; } = default!;
        public string Email { get; init; } = default!;
        public int Score { get; init; }
        public SatisfactionLevel Level { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
