using SalesService.Application.Queries.Customers.GetCustomerById;
using SalesService.Domain.Entities.Customer;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomer
{
    public class GetCustomerByIdQueryHandler(ICustomerRepository repository) : IGetCustomerByIdQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;
        public async Task<Customer?> HandleAsync(GetCustomerByIdQuery query)
        {
            return await _repository.GetByIdAsync(query.Id);
        }
    }
}
