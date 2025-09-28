using LogisticService.Domain.Entities;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace LogisticService.Infraestructure.Persistence.Repositories
{
    public class DeliveryZoneRepository : IDeliveryZoneRepository
    {
        private readonly LogisticDbContext _context;

        public DeliveryZoneRepository(LogisticDbContext context)
        {
            _context = context;
        }

        public async Task<DeliveryZone?> GetByIdAsync(int id)
        {
            return await _context.DeliveryZones
                .Include(z => z.ZoneAssignments)
                .FirstOrDefaultAsync(z => z.Id == id);
        }

        public async Task<IEnumerable<DeliveryZone>> GetAllAsync()
        {
            return await _context.DeliveryZones
                .Include(z => z.ZoneAssignments)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(DeliveryZone zone)
        {
            _context.DeliveryZones.Add(zone);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DeliveryZone zone)
        {
            _context.DeliveryZones.Update(zone);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(DeliveryZone zone)
        {
            _context.DeliveryZones.Remove(zone);
            await _context.SaveChangesAsync();
        }
    }
}
