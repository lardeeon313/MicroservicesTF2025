using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone
{
    public interface IDeleteDeliverZoneCommandHandler
    {
        Task<bool> HandleAsync(DeleteDeliveryZoneCommand command);
    }
}
