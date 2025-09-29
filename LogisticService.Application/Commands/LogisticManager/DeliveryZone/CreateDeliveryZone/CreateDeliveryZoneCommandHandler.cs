using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone
{
    public class CreateDeliveryZoneCommandHandler(IDeliveryZoneRepository repository, ILogger<CreateDeliveryZoneCommandHandler> logger) : ICreateDeliveryZoneCommandHandler
    {
        private readonly ILogger<CreateDeliveryZoneCommandHandler> _logger = logger;
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Manejador para Crear una zona de reparto
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<DeliveryZoneDto> HandleAsync(CreateDeliveryZoneCommand command)
        {
            var zone = new Domain.Entities.DeliveryZone(command.Name, command.Description);
            await _repository.AddAsync(zone);

            return new DeliveryZoneDto
            {
                Id = zone.Id,
                Name = zone.Name,
                Description = zone.Description
            };
        }
    }
}
