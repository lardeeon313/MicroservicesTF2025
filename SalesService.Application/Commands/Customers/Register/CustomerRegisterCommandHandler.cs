
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.Customer;
using SharedKernel.IntegrationEvents.SalesEvents.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Register
{
    public class CustomerRegisterCommandHandler(ICustomerRepository repository, IRabbitMQPublisher publisher) : ICustomerRegisterCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;
        private readonly IRabbitMQPublisher _publisher = publisher;

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
            };

            customer.Addresses = command.Addresses.Select(a => new Address
            {
                Street = a.Street,
                Number = a.Number,
                Apartment = a.Apartment,
                City = a.City,
                Province = a.Province,
                Country = a.Country,
                PostalCode = a.PostalCode,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                FormattedAddress = a.FormattedAddress,
                CustomerId = customer.Id
            }).ToList();

            await _repository.AddAsync(customer);

            // Publish event to RabbitMQ
            var customerCreatedEvent = new CustomerRegisteredIntegrationEvent
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
            };

            customerCreatedEvent.Addresses = command.Addresses.Select(a => new AddressDto
            {
                Street = a.Street,
                Number = a.Number,
                Apartment = a.Apartment,
                City = a.City,
                Province = a.Province,
                Country = a.Country,
                PostalCode = a.PostalCode,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                FormattedAddress = a.FormattedAddress,
                CustomerId = customer.Id
            }).ToList();

            await _publisher.PublishAsync(customerCreatedEvent, "customer_registered_queue");


            return true;
        }
    }
}
