using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone;
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
    public class DisableDeliveryZoneHandlerTests
    {
        private readonly Mock<IDeliveryZoneRepository> _repositoryMock;
        private readonly Mock<ILogger<DisableDeliveryZoneCommandHandler>> _loggerMock;
        private readonly DisableDeliveryZoneCommandHandler _handler;

        public DisableDeliveryZoneHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryZoneRepository>();
            _loggerMock = new Mock<ILogger<DisableDeliveryZoneCommandHandler>>();

            _handler = new DisableDeliveryZoneCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        [Fact(DisplayName ="Debe retornar false cuando la zona no existe")]
        public async Task HandleAsync_ShouldReturnFalse_WhenZoneDoesNotExist()
        {
            // Arrange
            var command = new DisableDeliveryZoneCommand(1);
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Domain.Entities.DeliveryZone)null!);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.False(result);
        }

        [Fact(DisplayName = "Debe retornar true cuando la zona ya está deshabilitada")]
        public async Task HandleAsync_ShouldReturnTrue_WhenZoneIsAlreadyDisabled()
        {
            // Arrange
            var zone = new Domain.Entities.DeliveryZone("Zona Norte", "Descripción",true);
            zone.Disable(); // ya está deshabilitada

            _repositoryMock.Setup(r => r.GetByIdAsync(zone.Id)).ReturnsAsync(zone);

            var command = new DisableDeliveryZoneCommand(zone.Id);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Never);
        }

        [Fact(DisplayName = "Debe deshabilitar la zona cuando está activa")]
        public async Task HandleAsync_ShouldDisableZone_WhenZoneIsActive()
        {
            // Arrange
            var zone = new Domain.Entities.DeliveryZone("Zona Oeste", "Otra descripción");

            // Forzamos un ID válido (solo para test)
            typeof(Domain.Entities.DeliveryZone)
                .GetProperty(nameof(Domain.Entities.DeliveryZone.Id))! 
                .SetValue(zone, 1);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(zone);

            var command = new DisableDeliveryZoneCommand(1);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);
            Assert.False(zone.IsActive);

            _repositoryMock.Verify(r => r.UpdateAsync(zone), Times.Once);
        }

        [Fact(DisplayName = "Debe lanzar excepción cuando el comando es nulo")]
        public async Task HandleAsync_ShouldThrowException_WhenCommandIsNull()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.HandleAsync(null!));
        }
    }
}
