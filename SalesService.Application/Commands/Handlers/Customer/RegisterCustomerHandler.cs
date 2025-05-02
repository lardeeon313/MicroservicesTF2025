using SalesService.Application.Exceptions;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using SalesService.Application.Commands.Customer;
using SalesService.Application.Commands.Customer.Interfaces;
using SalesService.Domain.IRepositories;

namespace SalesService.Application
{
    public class RegisterCustomerHandler(ICustomerRepository repository) : IRegisterCustomerCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;
        public async Task<string> Handle(RegisterCustomerCommand command)
        {
            var existingCustomer = _repository.GetByEmailAsync(command.Email);
            if (existingCustomer != null)
            {
                return Task.FromResult("Customer already exists");
            }

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = command.FirstName,
                LastName = command.LastName,
                Email = command.Email,
                PhoneNumber = command.Phonenumber,
                Address = command.Address

            };
            await _repository.AddAsync(customer);


            return Task.FromResult("Customer registered successfully");

        }                               

    }
}

