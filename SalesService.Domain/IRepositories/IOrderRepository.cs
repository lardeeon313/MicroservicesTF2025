using SalesService.Domain.Entities.DummyEntitie;
using SalesService.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SalesService.Domain.Entities;

namespace SalesService.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(Guid orderId);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetByStatusAsync(string status);
        Task UpdateAsync(Order order);
        Task CancelAsync(Guid orderId);
        Task AttachReceiptAsync(Guid orderId, string receiptBase64);
    }
}
