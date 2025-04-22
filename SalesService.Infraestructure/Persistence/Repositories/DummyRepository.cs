using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities.DummyEntitie;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class DummyRepository/*(SalesDbContext _context)*/ : IDummyRepository
    {
        // Se debe referenciar por parametro y por constructor, al "SalesDbContext" 
        // private readonly SalesDbContext context = _context;

        public async Task AddAsync(Dummy dummy)
        {
            // _context.Dummies.Add(dummy);
            // await _context.SaveChangesAsync();
        }
    }
}
