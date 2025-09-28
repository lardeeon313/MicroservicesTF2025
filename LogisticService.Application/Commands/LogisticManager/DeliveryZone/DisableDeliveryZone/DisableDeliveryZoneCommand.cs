using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone
{
    public class DisableDeliveryZoneCommand
    {
        public int ZoneId { get; set; }

        public DisableDeliveryZoneCommand(int zoneId)
        {
            ZoneId = zoneId;
        }
    }
}
