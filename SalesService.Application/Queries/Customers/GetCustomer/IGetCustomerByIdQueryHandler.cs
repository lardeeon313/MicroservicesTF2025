using SalesService.Application.Queries.Customers.GetCustomerById;
using SalesService.Domain.Entities.CustomerEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomer
{
    public interface IGetCustomerByIdQueryHandler
    {
        Task<Customer?> HandleAsync(GetCustomerByIdQuery query);
    }
}
    