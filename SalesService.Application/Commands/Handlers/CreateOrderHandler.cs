using SalesService.Application.Commands;
using SalesService.Application.Exceptions;
using SalesService.Application.Validations;
using SalesService.Infrastructure.Persistence;
using SalesService.Infrastructure.Messaging;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using SalesService.Infraestructure.Messaging.Publisher;

namespace SalesService.Application.Commands.Handlers
{
    public class CreateOrderHandler
    {
        private readonly SalesDbContext _context;
        private readonly IRabbitMQPublisher _rabbit;

        public CreateOrderHandler(SalesDbContext context, IRabbitMQPublisher rabbit)
        {
            _context = context;
            _rabbit = rabbit;
        }

        public async Task<Guid> HandleAsync(CreateOrderCommand cmd)
        {
            CreateOrderValidator.Validate(cmd);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == cmd.CustomerEmail);

            if (customer == null)
            {
                customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    FirstName = cmd.CustomerFirstName,
                    LastName = cmd.CustomerLastName,
                    Email = cmd.CustomerEmail,
                    Address = cmd.CustomerAddress
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }

            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Customer = customer, // Fix: Set the required 'Customer' property
                DeliveryDetail = cmd.DeliveryDetail,
                TotalAmount = cmd.Products.Sum(p => p.Quantity * p.UnitPrice),
                Items = cmd.Products.Select(p => new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductName = p.ProductName,
                    Quantity = p.Quantity,
                    UnitPrice = p.UnitPrice,
                    Order = null! // Explicitly set to null to satisfy the required property
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var @event = new OrderCreatedEvent(order.Id, customer.Id, order.TotalAmount);
            _rabbit.Publish(@event);

            return order.Id;
        }
    }
}

