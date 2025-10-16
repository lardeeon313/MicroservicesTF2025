using SalesService.Domain.Entities.CustomerEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerPaymentTypes
{
    public interface IGetCustomerPaymentTypesQueryHandler
    {
        Task<List<CustomerPaymentType>> HandleAsync(GetCustomerPaymentTypesQuery query);
    }
}
