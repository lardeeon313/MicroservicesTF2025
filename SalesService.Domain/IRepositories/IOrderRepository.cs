using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.IRepositories
{
    /// <summary>
    /// Repositorio para acceder a pedidos
    /// </summary>
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(int orderId);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetByStatusAsync(string status);
        Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId);
        Task UpdateAsync(Order order);
        Task DeleteAsync(Order order);
        Task AttachReceiptAsync(int orderId, string receiptBase64);
        Task<(List<Order> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    }
}
