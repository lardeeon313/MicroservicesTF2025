using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignOperatorToTeam
{
    /// <summary>
    /// Handler para asignar un operador a un equipo.
    /// </summary>
    public class AssignOperatorCommandHandler(IDeliveryTeamRepository repository, ILogger<AssignOperatorCommandHandler> logger) : IAssignOperatorCommandHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<AssignOperatorCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));       

        /// <summary>
        /// Asigna un operador a un equipo existente.
        /// </summary>
        public async Task<bool> AssignOperatorAsync(AssignOperatorCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError("❌ The team with ID {TeamId} not found.", command.TeamId);
                return false;
            }

            // ✅ Comparación Guid con Guid
            if (team.DeliveryOperators.Any(m => m.OperatorUserId == command.OperatorUserId))
            {
                _logger.LogWarning("⚠️ Operator {OperatorUserId} already assigned to team {TeamId}.", command.OperatorUserId, command.TeamId);
                return false; 
            }

            // Agregar operador
            team.AssignOperator(command.OperatorUserId);

            await _repository.UpdateAsync(team);

            _logger.LogInformation("✅ Operator {OperatorUserId} assigned to team {TeamId}.", command.OperatorUserId, command.TeamId);

            return true;
        }
    }
}

