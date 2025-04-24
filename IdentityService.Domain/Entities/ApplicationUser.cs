using IdentityService.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IdentityService.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? Name { get; set; }
        public string? LastName { get; set; }

        public DateTime HightDate { get; set; } = DateTime.UtcNow;

        public EmployedStatus Employed_Status { get; set; } = EmployedStatus.Active;

        public DateTime Validity { get; set; }
    }
}
