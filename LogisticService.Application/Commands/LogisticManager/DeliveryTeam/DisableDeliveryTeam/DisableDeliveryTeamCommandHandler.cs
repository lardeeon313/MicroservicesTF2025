using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam
{
    public class DisableDeliveryTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<DisableDeliveryTeamCommandHandler> logger) : IDisableDeliveryTeamCommandHandler
    {
        private readonly ILogger<DisableDeliveryTeamCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly IDeliveryTeamRepository _repository = repository;
        
        /// <summary>
        /// Commando para inhabilitar un equipo de reparto
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(DisableDeliveryTeamCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogWarning("Attempted to disable team {TeamId}, but it was not found.", command.TeamId);
                return false;
            }

            if (!team.IsActive)
            {
                _logger.LogInformation("Team {TeamId} is already disabled.", command.TeamId);
                return true;
            }

            team.Disable(); // método de dominio
            await _repository.UpdateAsync(team);

            _logger.LogInformation("Team {TeamId} has been disabled successfully.", command.TeamId);
            return true;
        }
    }
}
