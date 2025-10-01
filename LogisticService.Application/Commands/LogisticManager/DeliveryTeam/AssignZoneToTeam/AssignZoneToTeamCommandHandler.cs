using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam
{
    public class AssignZoneToTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<AssignZoneToTeamCommandHandler> logger) : IAssignZoneToTeamCommandHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository;
        private readonly ILogger<AssignZoneToTeamCommandHandler> _logger = logger;

        /// <summary>
        /// Handler para asignar una zona a un equipo
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task<bool> AssignZoneToTeam(AssignZoneToTeamCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError("❌ The team with ID {TeamId} not found.", command.TeamId);
                return false;
            }

            // ✅ Comparación Guid con Guid
            if (team.ZoneAssignments.Any(m => m.DeliveryZoneId == command.ZoneId))
            {
                _logger.LogWarning("⚠️ Zone {ZoneId} already assigned to team {TeamId}.", command.ZoneId, command.TeamId);
                return false;
            }

            // Agregar operador
            team.AssignZone(command.ZoneId);

            await _repository.UpdateAsync(team);

            _logger.LogInformation("✅ Zone {ZoneId} assigned to team {TeamId}.", command.ZoneId, command.TeamId);

            return true;
        }
    }
}
