using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
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
        public DbSet<OrderMissing> OrderMissings { get; set; }
        public DbSet<OrderMissingItem> OrderMissingItems { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<CustomerPaymentType> CustomerPaymentTypes { get; set; }


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

            modelBuilder.Entity<Order>(entity => {
                entity.Property(e => e.PaymentType)
                    .HasConversion<string>();
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(o => o.CreatedByUserId)
                    .IsRequired()
                    .HasMaxLength(450); // Como el guid del user.
            });

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany() 
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<OrderMissing>()
                .HasKey(om => om.Id);

            modelBuilder.Entity<OrderMissing>()
                .HasOne(om => om.Order)
                .WithMany(o => o.MissingReports)
                .HasForeignKey(om => om.OrderId);

            modelBuilder.Entity<OrderMissingItem>()
                .HasKey(mi => mi.Id);

            modelBuilder.Entity<OrderMissingItem>()
                .HasOne(mi => mi.OrderMissing)
                .WithMany(om => om.MissingItems)
                .HasForeignKey(mi => mi.OrderMissingId);

            modelBuilder.Entity<OrderMissingItem>()
                .HasOne(mi => mi.SalesOrderItem)
                .WithMany()
                .HasForeignKey(mi => mi.OrderItemId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeliveryAddress)
                .WithMany() // Una dirección no tiene por qué estar en muchas órdenes, pero lo dejamos así flexible
                .HasForeignKey(o => o.DeliveryAddressId)
                .OnDelete(DeleteBehavior.Restrict); // No queremos que borrar la dirección borre la orden

            modelBuilder.Entity<Address>()
                .HasOne(a => a.Customer)
                .WithMany(c => c.Addresses)
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CustomerPaymentType>()
                .HasOne(cpt => cpt.Customer)
                .WithMany(c => c.PaymentTypes)
                .HasForeignKey(cpt => cpt.CustomerId);
        }
    }
}
