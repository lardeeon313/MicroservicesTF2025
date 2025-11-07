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
        public DbSet<DeliveryTeam> DeliveryTeams { get; set; }
        public DbSet<DeliveryZone> DeliveryZones { get; set; }
        public DbSet<LogisticCustomer> Customers { get; set; }
        public DbSet<DeliveryTeamAssignment> DeliveryTeamAssignments { get; set; }
        public DbSet<DeliveryTeamMemberAssignment> DeliveryTeamMembers { get; set; }
        public DbSet<DeliveryTeamZoneAssignment> DeliveryTeamZoneAssignments { get; set; }
        public DbSet<LogisticAddress> Addresses { get; set; }
        public DbSet<LogisticOrder> LogisticOrders { get; set; }
        public DbSet<LogisticOrderItem> LogisticOrderItems { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
        public DbSet<DeliveryRejectionReason> DeliveryRejectionReasons { get; set; }    
        public DbSet<DeliveryIncident> DeliveryIncidents { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

            modelBuilder.Entity<DeliveryRejectionReason>()
                .HasOne(r => r.LogisticOrder)
                .WithMany(o => o.RejectionReasons)
                .HasForeignKey(r => r.LogisticOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DeliveryIncident>()
                .HasOne(i => i.LogisticOrder)
                .WithMany(o => o.DeliveryIncidents)
                .HasForeignKey(i => i.LogisticOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DeliveryTeam>(entity =>
            {
                entity.Property(e => e.IsActive)
                      .IsRequired();
            });

            modelBuilder.Entity<LogisticOrder>()
                .HasOne(o => o.AssignedDeliveryZone)
                .WithMany()
                .HasForeignKey(o => o.AssignedDeliveryZoneId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LogisticOrder>()
                .HasOne(o => o.AssignedDeliveryTeam)
                .WithMany()
                .HasForeignKey(o => o.AssignedDeliveryTeamId)
                .OnDelete(DeleteBehavior.Restrict);


        }
    }
}
