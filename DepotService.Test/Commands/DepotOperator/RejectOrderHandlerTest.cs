using DepotService.Application.Commands.DepotOperator.RejectOrder;
using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.DepotOperator
{
    public class RejectOrderCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<RejectOrderCommandHandler>> _loggerMock;
        private readonly RejectOrderCommandHandler _handler;

        public RejectOrderCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<RejectOrderCommandHandler>>();

            _handler = new RejectOrderCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ❌ Lanza excepción cuando el pedido no existe.
        /// </summary>
        [Fact]
        public async Task RejectOrder_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new RejectOrderCommand
            {
                DepotOrderId = 999,
                OperatorUserId = Guid.NewGuid(),
                RejectionReason = "No stock"
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            var act = async () => await _handler.RejectOrderHandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {command.DepotOrderId} not found.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }

        /// <summary>
        /// ❌ Lanza excepción cuando el pedido no está en estado "Assigned".
        /// </summary>
        [Fact]
        public async Task RejectOrder_ShouldThrow_WhenOrderIsNotAssigned()
        {
            // Arrange
            var orderId = 100;
            var order = new DepotOrderEntity
            {
                DepotOrderId = orderId,
                Status = OrderStatus.InPreparation // Estado inválido para rechazar
            };

            var command = new RejectOrderCommand
            {
                DepotOrderId = orderId,
                OperatorUserId = Guid.NewGuid(),
                RejectionReason = "No stock"
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(orderId))
                .ReturnsAsync(order);

            // Act
            var act = async () => await _handler.RejectOrderHandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {command.DepotOrderId} is not in the Assigned status.");

            _repositoryMock.Verify(r => r.UpdateOrderAsync(It.IsAny<DepotOrderEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
