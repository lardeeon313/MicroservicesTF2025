using DepotService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure
{
    public class DepotDbContext(DbContextOptions<DepotDbContext> options) : DbContext(options)
    {
        public DbSet<DepotOrder> DepotOrders { get; set; }
    }
}
