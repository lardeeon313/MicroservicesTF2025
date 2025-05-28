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
        Task<DepotTeamEntity?> GetByIdAsync (int id);
        Task<DepotTeamEntity?> GetByNameAsync(string name);
        Task AddAsync(DepotTeamEntity team);
        Task UpdateAsync(DepotTeamEntity team);

    }
}
