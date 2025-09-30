using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam
{
    public class RemoveZoneFromTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<RemoveZoneFromTeamCommandHandler> logger) : IRemoveZoneFromTeamCommandHandler
    {
        private readonly ILogger<RemoveZoneFromTeamCommandHandler> _logger = logger;
        private readonly IDeliveryTeamRepository _repository = repository;

        /// <summary>
        /// Handler para remover una zona de un equipo
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> RemoveZoneAsync(RemoveZoneFromTeamCommand command)
        {
            // Validación de parámetros
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError("❌ No se encontró el equipo con ID {TeamId}", command.TeamId);
                return false;
            }

            // Validar que el operario se encuentre en el equipo
            var zoneAssignment = team.ZoneAssignments.FirstOrDefault(a => a.DeliveryZoneId == command.ZoneId);

            if (zoneAssignment == null)
            {
                _logger.LogError("❌ El operador ya se encuentra asignado al equipo con ID {TeamId}", command.TeamId);
                return false;
            }

            // Remover el operario del equipo   
            team.RemoveZone(command.ZoneId);

            // Actualizar el equipo en el repositorio
            await _repository.UpdateAsync(team);

            // Registro de información
            _logger.LogInformation("✅ Operario {ZoneId} removido del equipo {TeamId}", command.ZoneId, command.TeamId);
            return true;
        }
    }
}
