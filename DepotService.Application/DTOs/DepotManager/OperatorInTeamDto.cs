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
    public class OperatorInTeamDto
    {
        public Guid OperatorByUserId { get; set; }
        public string RoleInTeam { get; set; } = "Operator";
        public DateTime AssignAt { get; set; } = DateTime.UtcNow;
    }
}
