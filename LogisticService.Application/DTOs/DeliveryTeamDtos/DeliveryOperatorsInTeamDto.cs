using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs
{
    public class DeliveryOperatorsInTeamDto
    {
        public Guid OperatorByUserId { get; set; }
        public string RoleInTeam { get; set; } = "Delivery Operator";
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public DateTime AssignAt { get; set; } = DateTime.UtcNow;
    }
}
