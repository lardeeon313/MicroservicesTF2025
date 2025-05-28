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
        public DbSet<DepotOrderEntity> DepotOrders { get; set; }
        public DbSet<DepotTeamEntity> DepotTeams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DepotTeamEntity>(team =>
            {
                team.HasKey(t => t.Id);
                team.Property(t => t.TeamName).IsRequired().HasMaxLength(100);

            });
        }
    }
}
