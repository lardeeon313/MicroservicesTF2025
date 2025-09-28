using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone
{
    public class DeleteDeliveryZoneCommand
    {
        public int Id { get; set; }

        public DeleteDeliveryZoneCommand(int id)
        {
            Id = id;
        }
    }
}
