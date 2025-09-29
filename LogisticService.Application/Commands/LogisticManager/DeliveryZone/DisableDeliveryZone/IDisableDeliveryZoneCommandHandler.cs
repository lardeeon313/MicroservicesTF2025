using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone
{
    public interface IDisableDeliveryZoneCommandHandler
    {
        Task<bool> HandleAsync(DisableDeliveryZoneCommand command);
    }
}
