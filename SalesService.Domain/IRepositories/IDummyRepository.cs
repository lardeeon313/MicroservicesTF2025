using SalesService.Domain.Entities.DummyEntitie;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.IRepositories
{
    public interface IDummyRepository
    {
        Task AddAsync(Dummy dummy);
    }
}
