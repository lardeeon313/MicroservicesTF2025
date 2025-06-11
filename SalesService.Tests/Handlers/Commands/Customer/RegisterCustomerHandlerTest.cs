using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Customers.Register;
using SalesService.Application.IntegrationEvents.Customer;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers
{
    public class RegisterCustomerHandlerTest
    {
        private readonly Mock<ICustomerRepository> _customerRepositoryMock;
        private readonly CustomerRegisterCommandHandler _handler;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;

        public RegisterCustomerHandlerTest()
        {
            _customerRepositoryMock = new Mock<ICustomerRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _handler = new CustomerRegisterCommandHandler(_customerRepositoryMock.Object, _publisherMock.Object);
        }


        // Test que simula un caso donde el cliente no existe previamente y se registra correctamente
        [Fact]
        public async Task RegisterHandle_ShouldRegisterCustomer_WhenDataIsValid()
        {
            // Arrange
            var command = new RegisterCustomerCommand(
                "Juan",
                "Perez",
                "juan.perez@email.com",
                "Córdoba 123",
                "3511112222"
            );

            _customerRepositoryMock
                .Setup(repo => repo.GetByEmailAsync(command.Email))
                .ReturnsAsync((Customer?)null); // Simulate that the customer does not exist

            _customerRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Customer>()))
                .Returns(Task.CompletedTask);

            _publisherMock
                .Setup(publisher => publisher.PublishAsync(It.IsAny<CustomerRegisteredIntegrationEvent>(), "customer_registered_queue"))
                .Returns(Task.CompletedTask);


            // Act
            var result = await _handler.RegisterHandle(command);

            // Assert 
            result.Should().BeTrue();

            _customerRepositoryMock.Verify(repo => repo.GetByEmailAsync(command.Email), Times.Once);

            _customerRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Customer>(c => 
            c.FirstName == command.FirstName &&
            c.LastName == command.LastName &&
            c.Email == command.Email
            )), Times.Once);

            _publisherMock.Verify(p => p.PublishAsync(
                It.Is<CustomerRegisteredIntegrationEvent>(e =>
                    e.FirstName == command.FirstName &&
                    e.Email == command.Email && 
                    e.PhoneNumber == command.PhoneNumber &&
                    e.Address == command.Address &&
                    e.CreatedAt <= DateTime.UtcNow
                ), "customer_registered_queue"), Times.Once);
        }

        // Test que simula un caso donde el cliente no existe previamente, pero falla al publicar el RabbitMQ  
        [Fact]
        public async Task RegisterHandle_ShouldThrow_WhenPublisherFails()
        {
            // arrange
            var command = new RegisterCustomerCommand(
                "Lucía",
                "González",
                "lucia.gonzalez@email.com",
                "Av. Siempre Viva 742",
                "3512345678"
            );

            _customerRepositoryMock
                .Setup(repo => repo.GetByEmailAsync(command.Email))
                .ReturnsAsync((Customer?)null); // Simulate that the customer does not exist

            _customerRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Customer>()))
                .Returns(Task.CompletedTask);

            _publisherMock
                .Setup(pub => pub.PublishAsync(It.IsAny<CustomerRegisteredIntegrationEvent>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("RabbitMQ unavailable")); // Simulate a failure in publishing

            // Act
            Func<Task> act = async () => await _handler.RegisterHandle(command);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("RabbitMQ unavailable");

            _customerRepositoryMock.Verify(repo => repo.GetByEmailAsync(command.Email), Times.Once);

            _customerRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Customer>(c =>
                c.FirstName == command.FirstName &&
                c.Email == command.Email
                )),Times.Once
            );

            _publisherMock.Verify(pub => pub.PublishAsync(
                It.IsAny<CustomerRegisteredIntegrationEvent>(),
                "customer_registered_queue"), 
                Times.Once
            );
        }


        // Test que simula un caso donde el cliente ya existe previamente
        [Fact]
        public async Task RegisterHandle_ShouldThrowException_WhenCustomerAlreadyExists()
        {
            // Arrange
            var command = new RegisterCustomerCommand(
                "Juan",
                "Perez",
                "juan.perez@email.com",
                "Córdoba 123",
                "3511112222"
            );

            var existingCustomer = new Customer
            {
                Id = Guid.NewGuid(),
                FirstName = command.FirstName,
                LastName = command.LastName,
                Email = command.Email,
                PhoneNumber = command.PhoneNumber,
                Address = command.Address,
            };

            _customerRepositoryMock
                .Setup(repo => repo.GetByEmailAsync(command.Email))
                .ReturnsAsync(existingCustomer); // Simulate that the customer already exists

            // Act
            Func<Task> act = async () => await _handler.RegisterHandle(command);

            // Assert

            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Customer with email {command.Email} already exists.");

            _customerRepositoryMock.Verify(repo => repo.GetByEmailAsync(command.Email), Times.Once);
            _customerRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Customer>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(
                It.IsAny<CustomerRegisteredIntegrationEvent>(),
                It.IsAny<string>()), Times.Never
            );
        }

        
    }
}
