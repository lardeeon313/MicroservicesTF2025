using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.IRepositories
{
    public interface ILogisticOrderRepository
    {
        Task<IEnumerable<LogisticOrder>> GetAllAsync();
        Task<LogisticOrder?> GetByIdAsync(int id);
        Task AddAsync(LogisticOrder order);
        Task UpdateAsync(LogisticOrder order);
        Task<IEnumerable<LogisticOrder>> GetOrdersByStatus(OrderStatus status);
        Task<(List<LogisticOrder> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<IEnumerable<LogisticOrder>> GetOrdersByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByTeamId(int teamId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByOperatorId(Guid operatorId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryZoneId(int zoneId);
        Task AddStatusHistoryAsync(OrderStatusHistory statusHistory);

    }
}
