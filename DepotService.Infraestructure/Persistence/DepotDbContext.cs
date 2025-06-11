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
        public DbSet<DepotOrderItemEntity> DepotOrderItems { get; set; }
        public DbSet<DepotTeamEntity> DepotTeams { get; set; }
        public DbSet<DepotTeamAssignment> TeamAssignments { get; set; }
        public DbSet<DepotOrderMissing> DepotOrderMissings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DepotTeamEntity>(team =>
            {
                team.HasKey(t => t.Id);
                team.Property(t => t.TeamName).IsRequired().HasMaxLength(100);

            });

            modelBuilder.Entity<DepotTeamAssignment>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<DepotTeamAssignment>()
                .HasOne(a => a.depotTeamEntity)
                .WithMany(t => t.Assignments)
                .HasForeignKey(a => a.DepotTeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DepotOrderEntity>(order =>
            {
                order.HasKey(o => o.DepotOrderId);
            });

            modelBuilder.Entity<DepotOrderEntity>()
                .HasOne(o => o.AssignedDepotTeam)
                .WithMany()
                .HasForeignKey(o => o.AssignedDepotTeamId);

            modelBuilder.Entity<DepotOrderEntity>()
                .HasMany(o => o.Items)
                .WithOne(i => i.DepotOrderEntity)
                .HasForeignKey(i => i.DepotOrderEntityId);

            modelBuilder.Entity<DepotOrderEntity>()
                .HasMany(o => o.Missings)
                .WithOne(m => m.DepotOrder)
                .HasForeignKey(m => m.DepotOrderId);

            modelBuilder.Entity<DepotOrderMissing>()
                .HasKey(m => m.MissingId);

            modelBuilder.Entity<DepotOrderMissing>()
                .HasMany(m => m.MissingItems)
                .WithOne(i => i.DepotOrderMissing)
                .HasForeignKey(i => i.OrderMissingId);

            modelBuilder.Entity<DepotOrderItemEntity>()
                .HasKey(i => i.Id);
        }
    }
}
