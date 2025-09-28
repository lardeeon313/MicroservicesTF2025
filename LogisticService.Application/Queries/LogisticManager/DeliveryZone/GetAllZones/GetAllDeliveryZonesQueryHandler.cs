using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetAllZones
{
    public class GetAllDeliveryZonesQueryHandler(IDeliveryZoneRepository repository) : IGetAllDeliveryZonesQueryHandler
    {
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Query para devolver todos las zonas
        /// </summary>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<IEnumerable<DeliveryZoneDto>> HandleAsync()
        {
            var zones = await _repository.GetAllAsync();
            return zones.Select(z => new DeliveryZoneDto
            {
                Id = z.Id,
                Name = z.Name,
                Description = z.Description
            });
        }
    }
}
