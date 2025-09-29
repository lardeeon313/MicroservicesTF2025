    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone
{
    public interface IUpdateDeliveryZoneCommandHandler
    {
        Task<bool> HandleAsync(UpdateDeliveryZoneCommand command);
    }
}
