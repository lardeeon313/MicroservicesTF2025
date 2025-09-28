using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryTeamMemberAssignment
    {
        public int Id { get; set; }
        public int DeliveryTeamId { get; set; }
        public DeliveryTeam DeliveryTeam { get; set; } = null!;

        public Guid OperatorUserId { get; set; } // Id del usuario/operario
        public string RoleInTeam { get; set; } = "Delivery Operator";
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
