using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities.Customer;
using SalesService.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure
{
    public class SalesDbContext(DbContextOptions<SalesDbContext> options) : DbContext(options)
    {
<<<<<<<<< Temporary merge branch 1
        public DbSet<Customer> Customers { get; set; } 
=========
        public DbSet<Customer> Customers { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }


    }
}
