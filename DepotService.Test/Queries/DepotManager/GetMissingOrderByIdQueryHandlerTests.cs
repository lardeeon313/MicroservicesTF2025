using DepotService.Application.Queries.DepotManager.GetMissingOrderById;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotManager
{
    public class GetMissingOrderByIdQueryHandlerTests
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<ILogger<GetMissingOrderByIdQueryHandler>> _loggerMock;
        private readonly GetMissingOrderByIdQueryHandler _handler;

        public GetMissingOrderByIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _loggerMock = new Mock<ILogger<GetMissingOrderByIdQueryHandler>>();

            _handler = new GetMissingOrderByIdQueryHandler(
                _repositoryMock.Object,
                _loggerMock.Object,
                context: null // No se usa en este handler
            );
        }

        [Fact]
        public async Task GetMissingOrderByIdAsync_ShouldReturnMissingOrderDto_WhenOrderExists()
        {
            // Arrange
            var missingOrderId = 1;
            var missingOrderEntity = new DepotOrderMissing
            {
                MissingId = missingOrderId,
                DepotOrderId = 100,
                SalesOrderId = 200,
                MissingReason = "Faltante en inventario",
                MissingDescription = "Descripción del faltante",
                MissingItems = new System.Collections.Generic.List<DepotOrderMissingItem>(),
                DescriptionResolution = "Pendiente resolución",
                MissingDate = DateTime.UtcNow,
                DepotOrder = null
            };

            _repositoryMock.Setup(r => r.GetMissingOrderByIdAsync(missingOrderId))
                .ReturnsAsync(missingOrderEntity);

            // Act
            var result = await _handler.GetMissingOrderByIdAsync(missingOrderId);

            // Assert
            result.Should().NotBeNull();
            result.MissingId.Should().Be(missingOrderId);
            result.MissingReason.Should().Be("Faltante en inventario");
            result.MissingDescription.Should().Be("Descripción del faltante");
        }

        [Fact]
        public async Task GetMissingOrderByIdAsync_ShouldThrowException_WhenOrderDoesNotExist()
        {
            // Arrange
            var missingOrderId = 999;

            _repositoryMock.Setup(r => r.GetMissingOrderByIdAsync(missingOrderId))
                .ReturnsAsync((DepotOrderMissing?)null);

            // Act
            Func<Task> act = async () => await _handler.GetMissingOrderByIdAsync(missingOrderId);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage($"Missing order with ID {missingOrderId} not found.");
        }
    }
}
