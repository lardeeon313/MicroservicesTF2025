using SalesService.Application.DTOs.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerAddresses
{
    public interface IGetCustomerAddressesQueryHandler
    {
        Task<List<AddressDto>> HandleAsync(GetCustomerAddressesQuery query);
    }
}
