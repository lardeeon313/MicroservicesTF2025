using LogisticService.Domain.Entities;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence.Repositories
{
    public class DeliveryTeamRepository(LogisticDbContext context) : IDeliveryTeamRepository
    {
        private readonly LogisticDbContext _context = context;
        public async Task AddAsync(DeliveryTeam team)
        {
            await _context.DeliveryTeams.AddAsync(team);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int teamId)
        {
            await _context.DeliveryTeams
                .Where(x => x.Id == teamId)
                .ExecuteDeleteAsync();
        }

        public async Task UpdateAsync(DeliveryTeam team)
        {
            await Task.Run(() => _context.DeliveryTeams.Update(team));
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DeliveryTeam>> GetAllAsync()
        {
            return await _context.DeliveryTeams
                .Include(t => t.ZoneAssignments)
                    .ThenInclude(za => za.DeliveryZone) 
                .Include(t => t.DeliveryOperators)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<DeliveryTeam?> GetByIdAsync(int id)
        {
            return await _context.DeliveryTeams
                .Include(t => t.ZoneAssignments)
                    .ThenInclude(za => za.DeliveryZone)
                .Include(t => t.DeliveryOperators)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<DeliveryTeam?> GetTeamByOperatorAsync(Guid operatorUserId)
        {
            return await _context.DeliveryTeams
                .Include(t => t.DeliveryOperators)
                .FirstOrDefaultAsync(t => t.DeliveryOperators.Any(a => a.OperatorUserId == operatorUserId));
        }
    }
}
