using LogisticService.Application.DTOs.DeliveryZoneDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetAllZones
{
    public interface IGetAllDeliveryZonesQueryHandler
    {
        Task<IEnumerable<DeliveryZoneDto>> HandleAsync();
    }
}
