using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone
{
    public class UpdateDeliveryZoneCommandHandler(IDeliveryZoneRepository repository) : IUpdateDeliveryZoneCommandHandler
    {
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Manejador para actualizar una zona
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(UpdateDeliveryZoneCommand command)
        {
            var zone = await _repository.GetByIdAsync(command.Id);
            if (zone == null) return false;

            zone.Update(command.Name, command.Description);
            await _repository.UpdateAsync(zone);

            return true;
        }
    }
}
