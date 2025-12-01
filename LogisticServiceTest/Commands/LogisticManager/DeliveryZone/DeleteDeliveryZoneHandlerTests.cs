using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone;
using LogisticService.Domain.IRepositories;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.DeliveryZone
{
    public class DeleteDeliveryZoneHandlerTests
    {
        private readonly Mock<IDeliveryZoneRepository> _repositoryMock;
        private readonly DeleteDeliverZoneCommandHandler _handler;

        public DeleteDeliveryZoneHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryZoneRepository>();
            _handler = new DeleteDeliverZoneCommandHandler(_repositoryMock.Object);
        }

        [Fact]
        public async Task HandleAsync_ShouldReturnFalse_WhenZoneDoesNotExist()
        {
            // Arrange
            var command = new DeleteDeliveryZoneCommand(10);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.Id))
                .ReturnsAsync((Domain.Entities.DeliveryZone?)null);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.False(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(command.Id), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Never);
        }

        [Fact]
        public async Task HandleAsync_ShouldDeleteZone_WhenZoneExists()
        {
            // Arrange
            var command = new DeleteDeliveryZoneCommand(1);

            var zone = new Domain.Entities.DeliveryZone("Zona Test", "Descripción test");
            zone.Id = 1; // set manually if needed

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.Id))
                .ReturnsAsync(zone);

            _repositoryMock
                .Setup(r => r.DeleteAsync(zone))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(command.Id), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(zone), Times.Once);
        }
    }
}
