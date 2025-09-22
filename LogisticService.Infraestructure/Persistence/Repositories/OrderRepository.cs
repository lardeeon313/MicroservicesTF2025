using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence.Repositories
{
    public class OrderRepository(LogisticDbContext context) : IOrderRepository
    {
        private readonly LogisticDbContext _context = context;

    }
}
