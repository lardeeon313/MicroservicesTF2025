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
        Task AddAsync(DepotOrderEntity order);
        Task<DepotOrderEntity?> GetByIdAsync(int depotOrderId);
    }
}
