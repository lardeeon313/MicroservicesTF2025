using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryTeamZoneAssignment
    {
        public int Id { get; set; }

        public int DeliveryTeamId { get; set; }
        public DeliveryTeam DeliveryTeam { get; set; } = null!;

        public int DeliveryZoneId { get; set; }
        public DeliveryZone DeliveryZone { get; set; } = null!;

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true; // permite habilitar/deshabilitar sin borrar
    }
}
