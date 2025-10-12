using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryOperatorToTeam.RemoveOperatorToTeam
{
    public class RemoveOperatorToTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<RemoveOperatorToTeamCommandHandler> logger) : IRemoveOperatorToTeamCommandHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository;        
        private readonly ILogger<RemoveOperatorToTeamCommandHandler> _logger = logger;

        /// <summary>
        /// Maneja el comando para remover un operario de un equipo.
        /// </summary>
        public async Task<bool> RemoveOperatorAsync(RemoveOperatorToTeamCommand command)
        {
            // Validación de parámetros
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError("❌ No se encontró el equipo con ID {TeamId}", command.TeamId);
                return false;
            }

            // Validar que el operario se encuentre en el equipo
            var operatorAssignment = team.DeliveryOperators.FirstOrDefault(a => a.OperatorUserId == command.OperatorUserId);
            if (operatorAssignment == null)
            {
                _logger.LogError("❌ El operario {OperatorUserId} no está asignado al equipo {TeamId}", command.OperatorUserId, command.TeamId);
                return false;
            }
                

            // Remover el operario del equipo   
            team.RemoveOperator(command.OperatorUserId);

            // Actualizar el equipo en el repositorio
            await _repository.UpdateAsync(team);

            // Registro de información
            _logger.LogInformation("✅ Operario {OperatorUserId} removido del equipo {TeamId}", command.OperatorUserId, command.TeamId);
            return true;
        }
    }
}
