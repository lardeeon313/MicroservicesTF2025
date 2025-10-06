using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class LogisticCustomer
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } 
        public string? SatisfactionDescription { get; set; }
        public int? SatisfactionScore { get; set; }

        public List<LogisticAddress> Addresses { get; set; } = new();
    }
}
