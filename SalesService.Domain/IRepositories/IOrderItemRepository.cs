using SalesService.Domain.Entities.OrderEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.IRepositories
{
    public interface IOrderItemRepository
    {
        Task AddAsync(OrderItem orderItem);
        Task<OrderItem?> GetByIdAsync(Guid orderItemId);
        Task<IEnumerable<OrderItem>> GetAllAsync();
        Task UpdateAsync(OrderItem orderItem);
        Task DeleteAsync(Guid orderItemId);
    }
}
