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
    public class DepotOrderRepository(DepotDbContext context) : IDepotOrderRepository
    {
        private readonly DepotDbContext _context = context;

        public async Task AddAsync(DepotOrderEntity order)
        {
            await _context.DepotOrders.AddAsync(order);
        }

        public async Task<DepotOrderEntity?> GetByIdAsync(int depotOrderId)
        {
            return await _context.DepotOrders.FindAsync(depotOrderId);
        }

        public async Task<IEnumerable<DepotOrderEntity?>> GetAllAsync()
        {
            return await _context.DepotOrders
                .Include(x => x.Items)
                .ToListAsync();
        }
    }
}
