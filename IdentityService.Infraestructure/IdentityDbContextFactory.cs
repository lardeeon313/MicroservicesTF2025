using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Infraestructure
{
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        public IdentityDbContext CreateDbContext(string[] args)
        {
            // Setea el directorio donde está tu API (startup project)
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "IdentityService.API");

            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();

            var connectionString = config.GetConnectionString("DefaultConnection");

            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString),
                b => b.MigrationsAssembly(typeof(IdentityDbContextFactory).Assembly.FullName)
            );

            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}
