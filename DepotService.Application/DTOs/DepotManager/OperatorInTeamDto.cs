using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager
{
    /// <summary>
    /// Represents an operator in a depot team.
    /// </summary>

    public class OperatorsInTeamDto
    {
        public Guid OperatorByUserId { get; set; }
        public string RoleInTeam { get; set; } = "Operator";
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public DateTime AssignAt { get; set; } = DateTime.UtcNow;
    }
}
