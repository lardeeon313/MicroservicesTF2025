using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.IRepositories
{
    public interface ITeamRepository
    {
        Task<DepotTeamEntity?> GetByIdAsync (int teamId);
        Task<DepotTeamEntity?> GetByNameAsync(string teamName);
        Task<IEnumerable<DepotTeamEntity>> GetAllAsync();
        Task AddAsync(DepotTeamEntity team);
        Task UpdateAsync(DepotTeamEntity team);
        Task DeleteAsync(int teamId);


    }
}
