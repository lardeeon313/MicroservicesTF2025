using DepotService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

namespace DepotService.Infrastructure
{
    public class DepotDbContextFactory : IDesignTimeDbContextFactory<DepotDbContext>
    {
        public DepotDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DepotDbContext>();

            // 💥 Cadena de conexión directa, reemplazá por la tuya
            var connectionString = "Server=localhost;Port=3307;Database=depot_db;User=root;Password=root;";

            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new DepotDbContext(optionsBuilder.Options);
        }
    }
}
