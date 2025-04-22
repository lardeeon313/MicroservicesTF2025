using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure
{
    public class DepotDbContext : DbContext
    {
        public DepotDbContext(DbContextOptions<DepotDbContext> options)
            : base(options)
        {
        }
    }
}
