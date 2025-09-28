using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryTeamAssignment
    {
        public int Id { get; set; }

        public int LogisticOrderId { get; set; }
        public LogisticOrder Order { get; set; } = null!;

        public int DeliveryTeamId { get; set; }
        public DeliveryTeam DeliveryTeam { get; set; } = null!;

        public int? DeliveryZoneId { get; set; }
        public DeliveryZone? DeliveryZone { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public Guid? AssignedByUserId { get; set; } // quién hizo la asignación (que usuario de LogisticService lo hizo).
    }
}
