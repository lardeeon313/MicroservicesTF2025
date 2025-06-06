using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotTeamAssignment
    {
        public int Id { get; set; }
        public int DepotTeamId { get; set; }
        public DepotTeamEntity depotTeamEntity { get; set; } = null!;
        public Guid OperatorUserId { get; set; }
        public string RoleInTeam { get; set; } = "Operator";
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
