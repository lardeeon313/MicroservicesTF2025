using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        public Task AddAsync(OrderItem orderItem)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid orderItemId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<OrderItem?> GetByIdAsync(Guid orderItemId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(OrderItem orderItem)
        {
            throw new NotImplementedException();
        }
    }
}
