using IdentityService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; } 
        public List<string> Roles { get; set; } = [];
        public EmployedStatus EmployedStatus { get; set; }
        public DateTime HightDate { get; set; }
        public DateTime Validity { get; set; }
    }
}
