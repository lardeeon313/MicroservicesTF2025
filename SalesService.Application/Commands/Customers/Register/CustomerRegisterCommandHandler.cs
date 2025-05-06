using SalesService.Application.IntegrationEvents.Customer;
using SalesService.Domain.Entities.Customer;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
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
                Address = command.Address,
            };

            await _repository.AddAsync(customer);

            // Publish event to RabbitMQ
            var customerCreatedEvent = new CustomerRegisteredIntegrationEvent
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Address = customer.Address,
            };

            await _publisher.PublishAsync(customerCreatedEvent, "customer_registered_queue");


            return true;
        }
    }
}
