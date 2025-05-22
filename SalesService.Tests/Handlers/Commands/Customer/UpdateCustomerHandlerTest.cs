using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Customers.Register;
using SalesService.Application.Commands.Customers.Update;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    public class UpdateCustomerHandlerTest
    {
        private readonly Mock<ICustomerRepository> _customerRepositoryMock;
        private readonly CustomerUpdateCommandHandler _handler;

        public UpdateCustomerHandlerTest()
        {
            _customerRepositoryMock = new Mock<ICustomerRepository>();
            _handler = new CustomerUpdateCommandHandler(_customerRepositoryMock.Object);
        }

        // Test que simula donde el update se realiza con exito.
        [Fact]
        public async Task UpdateHandle_ShouldUpdateCustomer_WhenCustomerExists()
        {
            // arrange
            var command = new UpdateCustomerCommand(
                Guid.NewGuid(),
                "Carlos",
                "López",
                "carlos.lopez@email.com",
                "Nueva Dirección 456",
                "3519876543"
            );

            var existingCustomer = new Customer
            {
                Id = command.Id,
                FirstName = "ViejoNombre",
                LastName = "ViejoApellido",
                Email = "viejo@email.com",
                Address = "Vieja Direccion",
                PhoneNumber = "1111111111"
            };

            _customerRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.Id))
                .ReturnsAsync(existingCustomer);

            _customerRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<Customer>()))
                .Returns(Task.CompletedTask);

            var handler = new CustomerUpdateCommandHandler(_customerRepositoryMock.Object);

            // act
            var result = await handler.UpdateHandle(command);

            // assert
            result.Should().BeTrue();

            _customerRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<Customer>(c =>
                c.Id == command.Id &&
                c.FirstName == command.FirstName &&
                c.LastName == command.LastName &&
                c.PhoneNumber == command.PhoneNumber &&
                c.Email == command.Email
            )), Times.Once);
        }

        // Test que simula donde no se encuentra el cliente a actualizar.
        [Fact]
        public async Task UpdateHandle_ShouldThrow_WhenCustomerNotFound()
        {
            // Arrange
            var command = new UpdateCustomerCommand(
                Guid.NewGuid(),
                "Carlos",
                "López",
                "carlos.lopez@email.com",
                "Nueva Dirección 456",
                "3519876543"
            );

            _customerRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.Id))
                .ReturnsAsync((Customer?)null); // Simulate that the customer does not exist

            var handler = new CustomerUpdateCommandHandler(_customerRepositoryMock.Object);

            // Act
            Func<Task> act = async () => await handler.UpdateHandle(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Customer with ID {command.Id} not found.");

            _customerRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Customer>()), Times.Never);

        }
    }
}
