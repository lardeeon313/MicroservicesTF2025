using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam
{
    public interface IDisableDeliveryTeamCommandHandler
    {
        Task<bool> HandleAsync(DisableDeliveryTeamCommand command);
    }
}
