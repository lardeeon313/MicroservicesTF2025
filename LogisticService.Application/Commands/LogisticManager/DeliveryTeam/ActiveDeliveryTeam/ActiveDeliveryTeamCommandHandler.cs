using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam
{
    public class ActiveDeliveryTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<ActiveDeliveryTeamCommandHandler> logger) : IActiveDeliveryTeamCommandHandler
    {
        private readonly ILogger<ActiveDeliveryTeamCommandHandler> _logger = logger;
        private readonly IDeliveryTeamRepository _repository = repository;
        public async Task<bool> HandleAsync(ActiveDeliveryTeamCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogWarning("Attempted to disable team {TeamId}, but it was not found.", command.TeamId);
                return false;
            }

            if (team.IsActive)
            {
                _logger.LogInformation("Team {TeamId} is already Active.", command.TeamId);
                return true;
            }

            team.Active(); // método de dominio
            await _repository.UpdateAsync(team);

            _logger.LogInformation("Team {TeamId} has been actived successfully.", command.TeamId);
            return true;
        }
    }
}
