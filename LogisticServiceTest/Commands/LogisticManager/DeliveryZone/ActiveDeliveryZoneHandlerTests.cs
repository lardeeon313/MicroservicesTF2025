using LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.DeliveryZone
{
    public class ActiveDeliveryZoneHandlerTests
    {
        private readonly Mock<IDeliveryZoneRepository> _repositoryMock;
        private readonly Mock<ILogger<ActiveDeliveryZoneCommandHandler>> _loggerMock;
        private readonly ActiveDeliveryZoneCommandHandler _handler;

        public ActiveDeliveryZoneHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryZoneRepository>();
            _loggerMock = new Mock<ILogger<ActiveDeliveryZoneCommandHandler>>();
            _handler = new ActiveDeliveryZoneCommandHandler(_repositoryMock.Object, _loggerMock.Object);
        }

        [Fact(DisplayName = "HandleAsync debe retornar false cuando la zona no existe")]
        public async Task HandleAsync_ReturnsFalse_WhenZoneDoesNotExist()
        {
            // Arrange
            var command = new ActiveDeliveryZoneCommand(1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync((Domain.Entities.DeliveryZone?)null);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.False(result);            

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Never);
        }

        [Fact(DisplayName = "HandleAsync debe retornar true cuando la zona ya está activa")]
        public async Task HandleAsync_ReturnsTrue_WhenZoneIsAlreadyActive()
        {
            // Arrange
            var zone = new Domain.Entities.DeliveryZone("Zone A", "Test Zone", true);

            Assert.True(zone.IsActive); // esto pasa ✔

            var command = new ActiveDeliveryZoneCommand(1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(zone);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);         

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Never);
        }

        [Fact(DisplayName = "HandleAsync debe activar la zona cuando está inactiva")]
        public async Task HandleAsync_ActivatesZone_WhenInactive()
        {
            // Arrange
            var zone = new Domain.Entities.DeliveryZone("Zone A", "Test Zone", true);
            zone.Disable(); // aseguramos que está inactiva

            var command = new ActiveDeliveryZoneCommand(1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(zone);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);
            Assert.True(zone.IsActive);

            _repositoryMock.Verify(r => r.UpdateAsync(zone), Times.Once);            
        }
    }
}
