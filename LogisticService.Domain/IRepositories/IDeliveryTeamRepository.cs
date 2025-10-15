using LogisticService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.IRepositories
{
    public interface IDeliveryTeamRepository
    {
        Task AddAsync(DeliveryTeam team);
        Task UpdateAsync(DeliveryTeam team);
        Task DeleteAsync(int teamId);
        Task<DeliveryTeam?> GetByIdAsync(int id);
        Task<IEnumerable<DeliveryTeam>> GetAllAsync();
        Task<DeliveryTeam?> GetTeamByOperatorAsync(Guid operatorUserId);
    }
}
