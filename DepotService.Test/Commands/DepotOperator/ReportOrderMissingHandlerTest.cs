using DepotService.Application.Commands.DepotOperator.ReportOrderMissing;
using DepotService.Application.DTOs.DepotOrder;
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
    public class ReportOrderMissingCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<ReportOrderMissingCommandHandler>> _loggerMock;
        private readonly ReportOrderMissingCommandHandler _handler;

        public ReportOrderMissingCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<ReportOrderMissingCommandHandler>>();

            _handler = new ReportOrderMissingCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// Caso feliz: Reporta un pedido faltante correctamente.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldReportMissing_WhenOrderIsValid()
        {
            // Arrange
            var depotOrderId = 1;
            var operatorUserId = Guid.NewGuid();

            var order = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                AssignedOperatorId = operatorUserId,
                Status = OrderStatus.InPreparation,
                SalesOrderId = 1001,
                Items = new List<DepotOrderItemEntity>() // puede estar vacío o con items
            };

            var missingItems = new List<DepotOrderItemsReportedDto>
            {
                new DepotOrderItemsReportedDto
                {
                    OrderItemId = 10,
                    Quantity = 2,
                    ProductBrand = "MarcaX",
                    ProductName = "ProductoY",
                    Packaging = "Caja"
                }
            };

            var command = new ReportOrderMissingCommand
            {
                DepotOrderId = depotOrderId,
                OperatorUserId = operatorUserId,
                MissingReason = "Faltante en stock",
                MissingDescription = "No llegó el pedido completo",
                MissingItems = missingItems
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId)).ReturnsAsync(order);
            _repositoryMock.Setup(r => r.AddMissing(It.IsAny<DepotOrderMissing>())).Returns(Task.CompletedTask);
            _contextMock.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().NotThrowAsync();

            _repositoryMock.Verify(r => r.AddMissing(It.Is<DepotOrderMissing>(m =>
                m.DepotOrderId == depotOrderId &&
                m.MissingReason == command.MissingReason &&
                m.MissingItems.Count == missingItems.Count
            )), Times.Once);

            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);

            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Order with ID {depotOrderId} reported as missing")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        /// <summary>
        /// Caso error: El pedido no existe.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new ReportOrderMissingCommand
            {
                DepotOrderId = 999,
                OperatorUserId = Guid.NewGuid(),
                MissingReason = "Razón",
                MissingDescription = "Descripción",
                MissingItems = new List<DepotOrderItemsReportedDto>()
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.DepotOrderId)).ReturnsAsync((DepotOrderEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Order with ID {command.DepotOrderId} not found.");

            _repositoryMock.Verify(r => r.AddMissing(It.IsAny<DepotOrderMissing>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// Caso error: El pedido no está asignado al operador que reporta.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOperatorIsNotAssigned()
        {
            // Arrange
            var depotOrderId = 1;
            var command = new ReportOrderMissingCommand
            {
                DepotOrderId = depotOrderId,
                OperatorUserId = Guid.NewGuid(),
                MissingReason = "Razón",
                MissingDescription = "Descripción",
                MissingItems = new List<DepotOrderItemsReportedDto>()
            };

            var order = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                AssignedOperatorId = Guid.NewGuid(), // diferente al del comando
                Status = OrderStatus.InPreparation,
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId)).ReturnsAsync(order);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {command.DepotOrderId} is not assigned to operator {command.OperatorUserId}.");

            _repositoryMock.Verify(r => r.AddMissing(It.IsAny<DepotOrderMissing>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// Caso error: El pedido no está en estado "InPreparation".
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenOrderIsNotInPreparation()
        {
            // Arrange
            var depotOrderId = 1;
            var operatorUserId = Guid.NewGuid();

            var order = new DepotOrderEntity
            {
                DepotOrderId = depotOrderId,
                AssignedOperatorId = operatorUserId,
                Status = OrderStatus.Assigned // Estado inválido para reporte faltante
            };

            var command = new ReportOrderMissingCommand
            {
                DepotOrderId = depotOrderId,
                OperatorUserId = operatorUserId,
                MissingReason = "Razón",
                MissingDescription = "Descripción",
                MissingItems = new List<DepotOrderItemsReportedDto>()
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(depotOrderId)).ReturnsAsync(order);

            // Act
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Order with ID {depotOrderId} is not in progress.");

            _repositoryMock.Verify(r => r.AddMissing(It.IsAny<DepotOrderMissing>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }
    }
}
