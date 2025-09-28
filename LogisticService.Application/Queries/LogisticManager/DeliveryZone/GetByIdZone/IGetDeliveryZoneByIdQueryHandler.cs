using LogisticService.Application.DTOs.DeliveryZoneDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetByIdZone
{
    public interface IGetDeliveryZoneByIdQueryHandler
    {
        Task<DeliveryZoneDto?> HandleAsync(int id);
    }
}
