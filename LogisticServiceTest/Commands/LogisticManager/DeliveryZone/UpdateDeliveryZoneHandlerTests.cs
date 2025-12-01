using LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone;
using LogisticService.Domain.IRepositories;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.DeliveryZone
{
    public class UpdateDeliveryZoneHandlerTests
    {
        private readonly Mock<IDeliveryZoneRepository> _repositoryMock;
        private readonly UpdateDeliveryZoneCommandHandler _handler;

        public UpdateDeliveryZoneHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryZoneRepository>();
            _handler = new UpdateDeliveryZoneCommandHandler(_repositoryMock.Object);
        }

        [Fact(DisplayName = "Debe retornar false cuando la zona no existe")]
        public async Task HandleAsync_ShouldReturnFalse_WhenZoneDoesNotExist()
        {
            // Arrange
            var command = new UpdateDeliveryZoneCommand(1, "Nueva Zona", "Nueva descripción");
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Domain.Entities.DeliveryZone)null!);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryZone>()), Times.Never);
        }

        [Fact(DisplayName = "Debe actualizar la zona y retornar true cuando la zona existe")]
        public async Task HandleAsync_ShouldUpdateZone_AndReturnTrue()
        {
            // Arrange
            var zone = new Domain.Entities.DeliveryZone("Zona Vieja", "Descripción vieja");

            _repositoryMock.Setup(r => r.GetByIdAsync(zone.Id)).ReturnsAsync(zone);

            var command = new UpdateDeliveryZoneCommand(zone.Id, "Zona Actualizada", "Descripción Actualizada");

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result);
            Assert.Equal("Zona Actualizada", zone.Name);
            Assert.Equal("Descripción Actualizada", zone.Description);

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
