using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence.Repositories
{
    public class LogisticOrderRepository(LogisticDbContext context) : ILogisticOrderRepository
    {
        private readonly LogisticDbContext _context = context;

    }
}
