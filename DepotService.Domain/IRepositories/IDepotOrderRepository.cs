using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
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
        Task UpdateOrderAsync (DepotOrderEntity order);
        Task<IEnumerable<DepotOrderEntity?>> GetAllAsync();
        Task<IEnumerable<DepotOrderEntity>> GetOrderByStatusAsync(string status);
        Task<IEnumerable<DepotOrderMissing>> GetMissingOrdersAsync();
        Task<DepotOrderMissing?> GetMissingOrderByIdAsync(int missingId);
        Task AddMissingOrderAsync(DepotOrderMissing missingOrder);
        Task UpdateMissingOrderAsync(DepotOrderMissing missingOrder);
        Task <IEnumerable<DepotOrderEntity>> GetAllByOperatorIdAsync(Guid operatorId);


    }
}
