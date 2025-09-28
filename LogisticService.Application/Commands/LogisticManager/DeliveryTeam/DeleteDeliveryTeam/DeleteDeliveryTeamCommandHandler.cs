using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DeleteDeliveryTeam
{
    public class DeleteDeliveryTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<DeleteDeliveryTeamCommandHandler> logger) : IDeleteDeliveryTeamCommandHandler
    {
        private readonly ILogger<DeleteDeliveryTeamCommandHandler> _logger = logger;
        private readonly IDeliveryTeamRepository _repository = repository;
        public async Task DeleteDeliveryTeamAsync(int teamId)
        {
            var team = await _repository.GetByIdAsync(teamId);
            if (team == null)
            {
                _logger.LogWarning("Attempted to delete non-existing delivery team with ID {TeamId}", teamId);
                throw new InvalidOperationException($"Delivery team with ID {teamId} does not exist.");
            }

            await _repository.DeleteAsync(teamId);
            _logger.LogInformation("Deleted delivery team with ID {TeamId}", teamId);

        }
    }
}
