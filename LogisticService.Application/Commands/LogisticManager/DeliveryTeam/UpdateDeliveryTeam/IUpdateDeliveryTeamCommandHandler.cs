using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam
{
    /// <summary>
    /// Interfaz para manejar el comando de actualización de un equipo de entrega.
    /// </summary>
    public interface IUpdateDeliveryTeamCommandHandler
    {
        Task UpdateDeliveryTeamAsync(UpdateDeliveryTeamCommand command);
    }
}
