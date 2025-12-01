using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Test.Commands.LogisticManager.DeliveryTeam
{
    public class DisableDeliveryTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<DisableDeliveryTeamCommandHandler>> _loggerMock;

        public DisableDeliveryTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<DisableDeliveryTeamCommandHandler>>();
        }

        // -------------------------------------------------------------
        [Fact(DisplayName = "Debe deshabilitar el equipo cuando existe y está activo")]
        public async Task DisableTeam_ShouldDisable_WhenTeamExistsAndIsActive()
        {
            // Arrange
            int teamId = 1;

            var team = new LogisticService.Domain.Entities.DeliveryTeam("Team A", "Test");            

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(team);

            _repositoryMock.Setup(r => r.UpdateAsync(team)).Returns(Task.CompletedTask);

            var handler = new DisableDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new DisableDeliveryTeamCommand(teamId);

            // Act
            var result = await handler.HandleAsync(command);

            // Assert
            Assert.True(result);
            Assert.False(team.IsActive);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);
        }

        // -------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar true cuando el equipo ya está deshabilitado")]
        public async Task DisableTeam_ShouldReturnTrue_WhenTeamAlreadyDisabled()
        {
            // Arrange
            int teamId = 2;

            var team = new LogisticService.Domain.Entities.DeliveryTeam("Team B", "Test");
            team.Disable(); // aseguramos que ya esté deshabilitado

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(team);

            var handler = new DisableDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new DisableDeliveryTeamCommand(teamId);

            // Act
            var result = await handler.HandleAsync(command);

            // Assert
            Assert.True(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<LogisticService.Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        // -------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task DisableTeam_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            int teamId = 999;

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync((LogisticService.Domain.Entities.DeliveryTeam?)null);

            var handler = new DisableDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new DisableDeliveryTeamCommand(teamId);

            // Act
            var result = await handler.HandleAsync(command);

            // Assert
            Assert.False(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<LogisticService.Domain.Entities.DeliveryTeam>()), Times.Never);
        }
    }
}
    

