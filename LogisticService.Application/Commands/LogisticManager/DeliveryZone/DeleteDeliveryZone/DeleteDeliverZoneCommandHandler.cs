using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone
{
    public class DeleteDeliverZoneCommandHandler(IDeliveryZoneRepository repository) : IDeleteDeliverZoneCommandHandler
    {
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Manejador para eliminar una zona
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> HandleAsync(DeleteDeliveryZoneCommand command)
        {
            var zone = await _repository.GetByIdAsync(command.Id);
            if (zone == null) return false;

            await _repository.DeleteAsync(zone);
            return true;
        }
    }
}
