using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone
{
    public interface IActiveDeliveryZoneCommandHandler 
    {
        Task<bool> HandleAsync(ActiveDeliveryZoneCommand command);
    }
}
