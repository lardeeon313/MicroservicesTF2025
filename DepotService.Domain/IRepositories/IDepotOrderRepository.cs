using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.IRepositories
{
    /// <summary>
    /// Repositorio para acceder a pedidos del Depósito
    /// </summary>
    public interface IDepotOrderRepository
    {
        Task AddAsync(DepotOrder order);
        Task<DepotOrder?> GetByIdAsync(int depotOrderId);
    }
}
