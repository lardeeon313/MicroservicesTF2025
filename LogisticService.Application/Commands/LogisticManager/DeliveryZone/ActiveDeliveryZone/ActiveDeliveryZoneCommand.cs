using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone
{
    public class ActiveDeliveryZoneCommand
    {
        public int ZoneId {  get; set; }

        public ActiveDeliveryZoneCommand(int zoneId)
        {
            ZoneId = zoneId;
        }
    }
}
