using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdminService.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace AdminService.Infraestructure.Persistence
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Dni)
                .IsUnique();

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.Role)
                    .HasConversion<string>()
                    .HasMaxLength(50);

                entity.Property(e => e.Status)
                    .HasConversion<string>()
                    .HasMaxLength(50);

                entity.Property(e => e.Sector)
                    .HasConversion<string>()
                    .HasMaxLength(50);
            });
        }
    }
}
