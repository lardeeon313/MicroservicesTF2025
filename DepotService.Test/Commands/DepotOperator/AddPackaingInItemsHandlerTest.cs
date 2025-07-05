using DepotService.Application.Commands.DepotOperator.AddPackaing;
using DepotService.Application.DTOs.DepotOperator.Request;
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
    public class AddPackaingCommandHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<AddPackaingCommandHandler>> _loggerMock;
        private readonly AddPackaingCommandHandler _handler;

        public AddPackaingCommandHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<AddPackaingCommandHandler>>();

            _handler = new AddPackaingCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Verifica que se agregan empaques correctamente cuando los items existen
        /// y tienen un estado válido (ReReceived, InPreparation, Assigned).
        /// </summary>
        [Fact]
        public async Task Handle_ShouldAddPackaging_WhenItemsExistAndStatusValid()
        {
            // Arrange
            var itemId = 1;
            var depotOrder = new DepotOrderEntity { DepotOrderId = 100, Status = OrderStatus.InPreparation };

            var item = new DepotOrderItemEntity
            {
                Id = itemId,
                DepotOrderEntity = depotOrder
            };

            var command = new AddPackagingCommand(new List<AddPackagingRequest>
            {
                new() { DepotOrderItemId = itemId, PackaingType = "Box" }
            });

            _repositoryMock.Setup(r => r.GetOrderItemsByIdsAsync(It.IsAny<List<int>>()))
                .ReturnsAsync(new List<DepotOrderItemEntity> { item });

            _repositoryMock.Setup(r => r.UpdateDepotOrderItemsAsync(It.IsAny<List<DepotOrderItemEntity>>()))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _handler.AddPackaingAsync(command);

            // Assert
            result.Should().BeTrue();
            item.PackagingType.Should().Be("Box");

            _repositoryMock.Verify(r => r.UpdateDepotOrderItemsAsync(It.IsAny<List<DepotOrderItemEntity>>()), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Once);
        }

        /// <summary>
        /// ❌ Verifica que lanza excepción si no se encuentran items con los IDs proporcionados.
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenItemsNotFound()
        {
            // Arrange
            var command = new AddPackagingCommand(new List<AddPackagingRequest>
            {
                new() { DepotOrderItemId = 99, PackaingType = "Bag" }
            });

            _repositoryMock.Setup(r => r.GetOrderItemsByIdsAsync(It.IsAny<List<int>>()))
                .ReturnsAsync(new List<DepotOrderItemEntity>());

            // Act
            var act = async () => await _handler.AddPackaingAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("No items found for the provided IDs.");

            _repositoryMock.Verify(r => r.UpdateDepotOrderItemsAsync(It.IsAny<List<DepotOrderItemEntity>>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }

        /// <summary>
        /// ❌ Verifica que lanza excepción si un item tiene un estado inválido
        /// (por ejemplo: Delivered).
        /// </summary>
        [Fact]
        public async Task Handle_ShouldThrow_WhenItemStatusIsInvalid()
        {
            // Arrange
            var itemId = 1;
            var depotOrder = new DepotOrderEntity { DepotOrderId = 100, Status = OrderStatus.SentToBilling }; // Estado inválido

            var item = new DepotOrderItemEntity
            {
                Id = itemId,
                DepotOrderEntity = depotOrder
            };

            var command = new AddPackagingCommand(new List<AddPackagingRequest>
            {
                new() { DepotOrderItemId = itemId, PackaingType = "Pallet" }
            });

            _repositoryMock.Setup(r => r.GetOrderItemsByIdsAsync(It.IsAny<List<int>>()))
                .ReturnsAsync(new List<DepotOrderItemEntity> { item });

            // Act
            var act = async () => await _handler.AddPackaingAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"Item with ID {itemId} cannot be updated because its status is {depotOrder.Status}.");

            _repositoryMock.Verify(r => r.UpdateDepotOrderItemsAsync(It.IsAny<List<DepotOrderItemEntity>>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(default), Times.Never);
        }
    }
}
