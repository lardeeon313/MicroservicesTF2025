using LogisticService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.IRepositories
{
    public interface IDeliveryZoneRepository
    {
        Task<DeliveryZone?> GetByIdAsync(int id);
        Task<IEnumerable<DeliveryZone>> GetAllAsync();
        Task AddAsync(DeliveryZone zone);
        Task UpdateAsync(DeliveryZone zone);
        Task DeleteAsync(DeliveryZone zone);
    }
}
