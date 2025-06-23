using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.SalesEvents.Customer
{
    public class CustomerDeletedIntegrationEvent
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateDeleted { get; set; }
    }
}
