using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Customers.GetCustomer;
using SalesService.Application.Queries.Customers.GetCustomerByEmail;
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
    public class GetCustomerByEmailHandlerTest
    {
        private readonly Mock<ICustomerRepository> _repositoryMock;
        private readonly GetCustomerByEmailQueryHandler _handler;

        public GetCustomerByEmailHandlerTest()
        {
            _repositoryMock = new Mock<ICustomerRepository>();
            _handler = new GetCustomerByEmailQueryHandler(_repositoryMock.Object);
        }

        // Cuando el email si existe.
        [Fact]
        public async Task HandleAsync_ShouldReturnCustomer_WhenEmailExist()
        {
            var email = "Juan@email.com";
            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = "Juan",
                LastName = "Pérez",
                Email = email,
                PhoneNumber = "3511234567",
                Address = "Calle Falsa 123"
            };

            _repositoryMock
                .Setup(r => r.GetByEmailAsync(email))
                .ReturnsAsync(customer);

            // Act
            var result = await _handler.HandleAsync(new GetCustomerByEmailQuery(email));

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(email);
            result.FirstName.Should().Be("Juan");

        }

    }
}
