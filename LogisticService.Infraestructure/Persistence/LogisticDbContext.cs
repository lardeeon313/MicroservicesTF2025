using LogisticService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Infraestructure.Persistence
{
    public class LogisticDbContext : DbContext
    {
        public LogisticDbContext(DbContextOptions<LogisticDbContext> options)
        : base(options)
        {
        }
        /// Delivery Teams
        public DbSet<DeliveryTeam> DeliveryTeams { get; set; }
        public DbSet<DeliveryZone> DeliveryZones { get; set; }
        public DbSet<LogisticCustomer> Customers { get; set; }
        public DbSet<DeliveryTeamAssignment> DeliveryTeamAssignments { get; set; }
        public DbSet<DeliveryTeamMemberAssignment> DeliveryTeamMembers { get; set; }
        public DbSet<DeliveryTeamZoneAssignment> DeliveryTeamZoneAssignments { get; set; }
        public DbSet<LogisticAddress> Addresses { get; set; }

        /// Order
        public DbSet<LogisticOrder> LogisticOrders { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // DELIVER TEAMS
            // Relación muchos-a-muchos: DeliveryTeam <-> Operator (Assignment como entidad)
            modelBuilder.Entity<DeliveryTeamMemberAssignment>()
                .HasOne(m => m.DeliveryTeam)
                .WithMany(t => t.DeliveryOperators)
                .HasForeignKey(m => m.DeliveryTeamId);

            modelBuilder.Entity<DeliveryTeamZoneAssignment>()
                .HasOne(z => z.DeliveryTeam)
                .WithMany(t => t.ZoneAssignments)
                .HasForeignKey(z => z.DeliveryTeamId);

            modelBuilder.Entity<DeliveryTeamZoneAssignment>()
                .HasOne(z => z.DeliveryZone)
                .WithMany(d => d.ZoneAssignments)
                .HasForeignKey(z => z.DeliveryZoneId);

            modelBuilder.Entity<DeliveryTeamAssignment>()
                .HasOne(a => a.DeliveryTeam)
                .WithMany()
                .HasForeignKey(a => a.DeliveryTeamId);

            modelBuilder.Entity<LogisticOrder>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<DeliveryTeam>(entity =>
            {
                entity.Property(e => e.IsActive)
                      .IsRequired();
            });

        }
    }
}
