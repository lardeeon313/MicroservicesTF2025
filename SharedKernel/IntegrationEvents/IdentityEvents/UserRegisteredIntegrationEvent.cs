using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.IdentityEvents
{
    public class UserRegisteredIntegrationEvent
    {
        public string UserIdentityId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;       
        public string Role { get; set; } = null!;
    }
}
