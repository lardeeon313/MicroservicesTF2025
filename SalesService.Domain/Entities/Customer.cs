using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities
{
    public class Customer
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    }
}
