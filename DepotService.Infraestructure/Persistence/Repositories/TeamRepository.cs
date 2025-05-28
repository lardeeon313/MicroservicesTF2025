using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Persistence.Repositories
{
    public class TeamRepository(DepotDbContext context) : ITeamRepository
    {
        private readonly DepotDbContext _context = context;
        public async Task AddAsync(DepotTeamEntity team)
        {
            await _context.DepotTeams.AddAsync(team);
        }

        public async Task<DepotTeamEntity?> GetByIdAsync(int id)
        {
            return await _context.DepotTeams.FindAsync(id);
        }

        public async Task<DepotTeamEntity?> GetByNameAsync(string name)
        {
            return await _context.DepotTeams
                .FirstOrDefaultAsync(x => x.TeamName == name);
                
        }

        public Task UpdateAsync(DepotTeamEntity team)
        {
            _context.DepotTeams.Update(team);
            return _context.SaveChangesAsync();
        }
    }
}
