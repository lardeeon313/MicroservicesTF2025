using SalesService.Application.DTOs.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetPagedCustomers
{
    public interface IGetPagedCustomersQueryHandler
    {
        Task<PagedCustomerResponse> HandleAsync(GetPagedCustomersQuery query, CancellationToken cancellationToken);
    }
}
