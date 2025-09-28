using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone
{
    public class ActiveDeliveryZoneCommandHandler(IDeliveryZoneRepository repository, ILogger<ActiveDeliveryZoneCommandHandler> logger) : IActiveDeliveryZoneCommandHandler
    {
        private readonly ILogger<ActiveDeliveryZoneCommandHandler> _logger = logger;
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Commando para 
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(ActiveDeliveryZoneCommand command)
        {
            var zone = await _repository.GetByIdAsync(command.ZoneId);
            if (zone == null)
            {
                _logger.LogWarning("Attempted to disable team {ZoneId}, but it was not found.", command.ZoneId);
                return false;
            }

            if (zone.IsActive)
            {
                _logger.LogInformation("Team {ZoneId} is already Active.", command.ZoneId);
                return true;
            }

            zone.Active(); // método de dominio
            await _repository.UpdateAsync(zone);

            _logger.LogInformation("Team {ZoneId} has been actived successfully.", command.ZoneId);
            return true;
        }
    }
}
