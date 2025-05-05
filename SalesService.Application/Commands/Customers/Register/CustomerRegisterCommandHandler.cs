using SalesService.Domain.Entities.Customer;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Register
{
    public class CustomerRegisterCommandHandler(ICustomerRepository repository) : ICustomerRegisterCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<bool> RegisterHandle(RegisterCustomerCommand command)
        {
            var existsCustomer = await _repository.GetByEmailAsync(command.Email);

            if (existsCustomer != null)
            {
               throw new InvalidOperationException($"Customer with email {command.Email} already exists.");
            }

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = command.FirstName,
                LastName = command.LastName,
                Email = command.Email,
                PhoneNumber = command.PhoneNumber,
                Address = command.Address,
            };

            await _repository.AddAsync(customer);
            return true;
        }
    }
}
