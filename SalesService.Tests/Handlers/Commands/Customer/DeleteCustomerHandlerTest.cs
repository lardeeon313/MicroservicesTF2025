using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Customers.Delete;
using SalesService.Application.IntegrationEvents.Customer;
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
    public class DeleteCustomerHandlerTest
    {
        private readonly Mock<ICustomerRepository> _repositoryMock;
        private readonly CustomerDeleteCommandHandler _handler;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;

        public DeleteCustomerHandlerTest()
        {
            _repositoryMock = new Mock<ICustomerRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _handler = new CustomerDeleteCommandHandler(_repositoryMock.Object, _publisherMock.Object);
        }


        // Test exitoso, cuando eliminamos el Cliente.
        [Fact]
        public async Task DeleteHandle_ShouldDeleteCustomer_WhenCustomerExists()
        {
            // Arrange
            var customerId = Guid.NewGuid();
            var customer = new Customer
            {
                Id = customerId,
                FirstName = "Pedro",
                Email = "pedro@email.com"
            };

            var command = new DeleteCustomerCommand(customerId);

            _repositoryMock.Setup(r => r.GetByIdAsync(customerId)).ReturnsAsync(customer);
            _repositoryMock.Setup(r => r.DeleteAsync(customerId)).Returns(Task.CompletedTask);
            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<CustomerDeletedIntegrationEvent>(), "customer_deleted_queue"))
                          .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.DeleteHandle(command);

            // Assert
            result.Should().BeTrue();

            _repositoryMock.Verify(r => r.DeleteAsync(customerId), Times.Once);
            _publisherMock.Verify(p => p.PublishAsync(It.Is<CustomerDeletedIntegrationEvent>(e => e.Id == customerId), "customer_deleted_queue"), Times.Once);
        }

        // Test donde el cliente no existe
        [Fact]
        public async Task DeleteHandle_ShouldThrow_WhenCustomerNotFound()
        {
            // Arrange
            var customerId = Guid.NewGuid();
            var command = new DeleteCustomerCommand(customerId);

            _repositoryMock.Setup(r => r.GetByIdAsync(customerId)).ReturnsAsync((Customer?)null);

            // Act
            Func<Task> act = async () => await _handler.DeleteHandle(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Customer with ID {customerId} not found.");

            _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
            _publisherMock.Verify(p => p.PublishAsync(It.IsAny<CustomerDeletedIntegrationEvent>(), It.IsAny<string>()), Times.Never);
        }


        // Test donde falla la publicacion de RabbitMQ
        [Fact]
        public async Task DeleteHandle_ShouldThrow_WhenPublishingFails()
        {
            // Arrange
            var customerId = Guid.NewGuid();
            var customer = new Customer
            {
                Id = customerId,
                FirstName = "Pedro",
                Email = "pedro@email.com"
            };

            var command = new DeleteCustomerCommand(customerId);

            _repositoryMock.Setup(r => r.GetByIdAsync(customerId)).ReturnsAsync(customer);
            _repositoryMock.Setup(r => r.DeleteAsync(customerId)).Returns(Task.CompletedTask);
            _publisherMock.Setup(p => p.PublishAsync(It.IsAny<CustomerDeletedIntegrationEvent>(), "customer_deleted_queue"))
                          .ThrowsAsync(new Exception("RabbitMQ failure"));

            // Act
            Func<Task> act = async () => await _handler.DeleteHandle(command);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("RabbitMQ failure");

            _repositoryMock.Verify(r => r.DeleteAsync(customerId), Times.Once);
        }
    }
}
