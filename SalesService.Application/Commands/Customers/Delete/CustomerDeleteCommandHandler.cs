using RabbitMQ.Client;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Delete
{
    public class CustomerDeleteCommandHandler(ICustomerRepository repository) : ICustomerDeleteCommandHandler
    {
        private readonly ICustomerRepository _customerRepository = repository;

        public async Task<bool> DeleteHandle(DeleteCustomerCommand command)
        {
            var customer = await _customerRepository.GetByIdAsync(command.Id);
            if (customer == null)
                throw new KeyNotFoundException($"Customer with ID {command.Id} not found.");

            await _customerRepository.DeleteAsync(customer.Id);

            return true;
        }


    }
}
