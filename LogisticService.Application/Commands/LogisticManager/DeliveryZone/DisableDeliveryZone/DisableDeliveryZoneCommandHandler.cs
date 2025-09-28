using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone
{
    public class DisableDeliveryZoneCommandHandler(IDeliveryZoneRepository repository, ILogger<DisableDeliveryZoneCommandHandler> logger) : IDisableDeliveryZoneCommandHandler
    {
        private readonly ILogger<DisableDeliveryZoneCommandHandler> _logger = logger;
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Commando para inhabilitar una zona
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(DisableDeliveryZoneCommand command)
        {
            var zone = await _repository.GetByIdAsync(command.ZoneId);
            if (zone == null)
            {
                _logger.LogWarning("Attempted to disable team {ZoneId}, but it was not found.", command.ZoneId);
                return false;
            }

            if (!zone.IsActive)
            {
                _logger.LogInformation("Team {ZoneId} is already disabled.", command.ZoneId);
                return true;
            }

            zone.Disable(); // método de dominio
            await _repository.UpdateAsync(zone);

            _logger.LogInformation("Team {ZoneId} has been disabled successfully.", command.ZoneId);
            return true;
        }
    }
}
