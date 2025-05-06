using RabbitMQ.Client;
using SalesService.Application.IntegrationEvents.Customer;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Delete
{
    public class CustomerDeleteCommandHandler(ICustomerRepository repository, IRabbitMQPublisher publisher) : ICustomerDeleteCommandHandler
    {
        private readonly ICustomerRepository _customerRepository = repository;
        private readonly IRabbitMQPublisher _publisher = publisher;

        public async Task<bool> DeleteHandle(DeleteCustomerCommand command)
        {
            var customer = await _customerRepository.GetByIdAsync(command.Id);
            if (customer == null)
                throw new KeyNotFoundException($"Customer with ID {command.Id} not found.");

            await _customerRepository.DeleteAsync(customer.Id);

            var integrationEvent = new CustomerDeletedIntegrationEvent
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                Email = customer.Email,
                DateDeleted = DateTime.UtcNow,
            };

            await _publisher.PublishAsync(integrationEvent, "customer_deleted_queue");

            return true;
        }


    }
}
