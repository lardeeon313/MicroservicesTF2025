using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam
{
    /// <summary>
    /// Interfaz para el manejador del comando de creación de un equipo de entrega.
    /// </summary>
    public interface ICreateDeliveryTeamCommandHandler
    {
        Task CreateDeliveryTeamAsync(CreateDeliveryTeamCommand command);
    }
}
