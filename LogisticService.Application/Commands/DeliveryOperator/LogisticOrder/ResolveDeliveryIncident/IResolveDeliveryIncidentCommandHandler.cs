using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident
{
    public interface IResolveDeliveryIncidentCommandHandler
    {
        Task<bool> HandleAsync(ResolveDeliveryIncidentCommand command);
    }
}
