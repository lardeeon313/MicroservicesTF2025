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
<<<<<<< HEAD

        public string OperatorUserId { get; set; } = string.Empty;

        public Guid OperatorUserId { get; set; } 

=======
        public Guid OperatorUserId { get; set; } 
>>>>>>> origin/feature/milton-microservicestf2025
        public string RoleInTeam { get; set; } = "Operator";
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
