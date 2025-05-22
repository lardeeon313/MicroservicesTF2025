using SalesService.Application.DTOs.Customer;
using SalesService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerByEmail
{
    public interface IGetCustomerByEmailQueryHandler
    {
        Task<CustomerResponse?> HandleAsync(GetCustomerByEmailQuery query);
    }
}
