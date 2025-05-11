using FluentAssertions;
using Moq;
using SalesService.Application.Queries.Customers.GetAllCustomers;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    public class GetAllCustomersHandlerTest
    {
        private readonly Mock<ICustomerRepository> _repositoryMock;
        private readonly GetAllCustomersQueryHandler _handler;

        public GetAllCustomersHandlerTest()
        {
            _repositoryMock = new Mock<ICustomerRepository>();
            _handler = new GetAllCustomersQueryHandler(_repositoryMock.Object);
        }

        // Test 1: Devuelve todos los clientes correctamente. 
        [Fact]
        public async Task HandleAsync_ShouldReturnAllCustomers_WhenTheyExist()
        {
            // Arrange
            var customers = new List<Customer>
            {
                new Customer
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Juan",
                    LastName = "Pérez",
                    Email = "juan@email.com",
                    PhoneNumber = "3511234567",
                    Address = "Calle Falsa 123"
                },
                new Customer
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Ana",
                    LastName = "Gomez",
                    Email = "ana@email.com",
                    PhoneNumber = "3517654321",
                    Address = "Calle Verdadera 321"
                }
            };

            _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(customers);

            // Act
            var result = await _handler.HandleAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(r => r.Email == "juan@email.com");
            result.Should().Contain(r => r.FirstName == "Ana");
        }

        // Test 2 – Devuelve lista vacía si no hay clientes
        [Fact]
        public async Task HandleAsync_ShouldReturnEmptyList_WhenNoCustomersExist()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Customer>());

            // Act
            var result = await _handler.HandleAsync();

            // Assert
            result.Should().BeEmpty();
        }

    }
}
