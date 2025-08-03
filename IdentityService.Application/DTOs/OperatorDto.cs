using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.DTOs
{
    public class OperatorDto
    {
        public string Id { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}
