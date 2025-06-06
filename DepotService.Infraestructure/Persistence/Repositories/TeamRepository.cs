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

        public async Task DeleteAsync(int teamId)
        {
            await _context.DepotTeams
                .Where(x => x.Id == teamId)
                .ExecuteDeleteAsync();
        }

        public async Task<IEnumerable<DepotTeamEntity>> GetAllAsync()
        {
            return await _context.DepotTeams
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<DepotTeamEntity?> GetByIdAsync(int teamId)
        {
            return await _context.DepotTeams
                .Include(t => t.Assignments)
                .FirstOrDefaultAsync(t => t.Id == teamId);
        }

        public async Task<DepotTeamEntity?> GetByNameAsync(string teamName)
        {
            return await _context.DepotTeams
                .FirstOrDefaultAsync(x => x.TeamName == teamName);
                
        }

        public Task UpdateAsync(DepotTeamEntity team)
        {
            _context.DepotTeams.Update(team);
            return _context.SaveChangesAsync();
        }
    }
}
