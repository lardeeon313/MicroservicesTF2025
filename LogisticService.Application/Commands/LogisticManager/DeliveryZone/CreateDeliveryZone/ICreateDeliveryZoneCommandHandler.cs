using LogisticService.Application.DTOs.DeliveryZoneDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone
{
    public interface ICreateDeliveryZoneCommandHandler
    {
        Task<DeliveryZoneDto> HandleAsync(CreateDeliveryZoneCommand command);
    }
}
