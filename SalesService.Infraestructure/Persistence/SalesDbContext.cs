using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.Entities.OrderEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure
{
    public class SalesDbContext(DbContextOptions<SalesDbContext> options) : DbContext(options)
    {
        public DbSet<Customer> Customers { get; set; } 
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade); // Si se elimina una orden, también los items

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Status)
                    .HasConversion<string>();
            });

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany() 
                .HasForeignKey(o => o.CustomerId);      
        }
    }
}
