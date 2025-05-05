using SalesService.Domain.Entities.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.IRepositories
{
    public interface ICustomerRepository
    {
        Task AddAsync(Customer customer);
        Task<Customer?> GetByIdAsync(Guid customerId);
        Task<IEnumerable<Customer>> GetAllAsync();
        Task UpdateAsync(Customer customer);
        Task DeleteAsync(Guid customerId);
        Task<Customer?> GetByEmailAsync(string? email);
    }
}
