using FluentAssertions;
using Moq;
using SalesService.Application.Commands.Orders.Delete;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Messaging.Publisher;
using SharedKernel.IntegrationEvents.SalesEvents.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Tests.Handlers.Commands
{
    /// <summary>
    /// Pruebas unitarias para DeleteOrderCommandHandler.
    /// </summary>
    public class DeleteOrderHandlerTest
    {
        private readonly Mock<IOrderRepository> _repositoryMock;
        private readonly Mock<IRabbitMQPublisher> _publisherMock;
        private readonly DeleteOrderCommandHandler _handler;

        public DeleteOrderHandlerTest()
        {
            _repositoryMock = new Mock<IOrderRepository>();
            _publisherMock = new Mock<IRabbitMQPublisher>();
            _handler = new DeleteOrderCommandHandler(_repositoryMock.Object, _publisherMock.Object);
        }

        [Fact(DisplayName = "Debería eliminar una orden y publicar evento")]
        public async Task HandleAsync_ShouldDeleteOrder_AndPublishEvent()
        {
            var command = new DeleteOrderCommand(3, "Pedido duplicado");
            var order = new Order { Id = 3 };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.Id)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.DeleteAsync(order)).Returns(Task.CompletedTask);

            var result = await _handler.HandleAsync(command);

            result.Should().BeTrue();

            _publisherMock.Verify(p => p.PublishAsync(
                It.IsAny<OrderDeleteIntegrationEvent>(), "order_deleted_queue"), Times.Once);
        }

        [Fact(DisplayName = "Debe lanzar excepción si la orden no existe")]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            var command = new DeleteOrderCommand(77, "PedidoDuplicado");
            _repositoryMock.Setup(r => r.GetByIdAsync(command.Id)).ReturnsAsync((Order)null!);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.HandleAsync(command));
        }


    }
}
