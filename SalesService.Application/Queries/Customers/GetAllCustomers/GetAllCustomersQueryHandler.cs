using SalesService.Application.DTOs.Customer;
using SalesService.Domain.Entities.Customer;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetAllCustomers
{
    public class GetAllCustomersQueryHandler(ICustomerRepository repository) : IGetAllCustomersQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;
        public async Task<IEnumerable<CustomerResponse>> HandleAsync()
        {
            var customers = await _repository.GetAllAsync();

            // Proyectar a Dto
            return customers.Select(c => new CustomerResponse
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Address = c.Address
            });
        }
    }
    
}
