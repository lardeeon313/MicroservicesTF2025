using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Update
{
    public class CustomerUpdateCommandHandler(ICustomerRepository repository) : ICustomerUpdateCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<bool> UpdateHandle(UpdateCustomerCommand command)
        {
            // Validamos si el ID del cliente existe
            var customer = await _repository.GetByIdAsync(command.Id);
            if (customer == null)
                throw new KeyNotFoundException($"Customer with ID {command.Id} not found.");

            // Validamos si el correo electrónico ya existe
            var existing = await _repository.GetByEmailAsync(command.Email);
            if (existing != null && existing.Id != command.Id)
                throw new InvalidOperationException($"Email {command.Email} is already taken by another customer.");

            
            customer.FirstName = command.FirstName;
            customer.LastName = command.LastName;
            customer.PhoneNumber = command.PhoneNumber;
            customer.Address = command.Address;
            customer.Email = command.Email;

            await _repository.UpdateAsync(customer);
            return true;
        }
    }
}
