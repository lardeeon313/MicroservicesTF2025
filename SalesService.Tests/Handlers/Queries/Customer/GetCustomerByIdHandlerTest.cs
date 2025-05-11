using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Customers.GetCustomer;
using SalesService.Application.Queries.Customers.GetCustomerById;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    public class GetCustomerByIdHandlerTest
    {
        private readonly Mock<ICustomerRepository> _repositoryMock;
        private readonly GetCustomerByIdQueryHandler _handler;

        public GetCustomerByIdHandlerTest()
        {
            _repositoryMock = new Mock<ICustomerRepository>();
            _handler = new GetCustomerByIdQueryHandler(_repositoryMock.Object);
        }

        // Cuando el Cliente si existe.
        [Fact]
        public async Task HandleAsync_ShouldReturnCustomer_WhenCustomerExists()
        {
            // Arrange
            var customerId = Guid.NewGuid();
            var customer = new Customer
            {
                Id = customerId,
                FirstName = "Juan",
                LastName = "Pérez",
                Email = "juan@email.com",
                PhoneNumber = "3511234567",
                Address = "Calle Falsa 123"
            };

            _repositoryMock
                .Setup(r => r.GetByIdAsync(customerId))
                .ReturnsAsync(customer);

            // Act
            var result = await _handler.HandleAsync(new GetCustomerByIdQuery(customerId));

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(customerId);
            result.Email.Should().Be("juan@email.com");
        }

        
    }
}
