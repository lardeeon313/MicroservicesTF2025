using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetByIdZone
{
    public class GetDeliveryZoneByIdQueryHandler(IDeliveryZoneRepository repository) : IGetDeliveryZoneByIdQueryHandler
    {
        private readonly IDeliveryZoneRepository _repository = repository;

        /// <summary>
        /// Query para devolver una zona por su Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<DeliveryZoneDto?> HandleAsync(int id)
        {
            var zone = await _repository.GetByIdAsync(id);
            if (zone == null) return null;

            return new DeliveryZoneDto
            {
                Id = zone.Id,
                Name = zone.Name,
                Description = zone.Description
            };
        }
    }
}
