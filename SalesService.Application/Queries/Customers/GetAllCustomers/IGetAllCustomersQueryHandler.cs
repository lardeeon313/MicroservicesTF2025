using SalesService.Application.DTOs.Customer;
using SalesService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetAllCustomers
{
    public interface IGetAllCustomersQueryHandler
    {
        Task<IEnumerable<CustomerResponse>> HandleAsync();
    }
}
