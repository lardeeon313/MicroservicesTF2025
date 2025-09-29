using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam
{
    public interface IActiveDeliveryTeamCommandHandler
    {
        Task<bool> HandleAsync(ActiveDeliveryTeamCommand command);
    }
}
