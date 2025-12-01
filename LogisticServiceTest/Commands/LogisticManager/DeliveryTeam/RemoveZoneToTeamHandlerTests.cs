using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam;
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
    public class RemoveZoneToTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<RemoveZoneFromTeamCommandHandler>> _loggerMock;
        private readonly RemoveZoneFromTeamCommandHandler _handler;

        public RemoveZoneToTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<RemoveZoneFromTeamCommandHandler>>();
            _handler = new RemoveZoneFromTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);
        }

        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task RemoveZoneAsync_ReturnsFalse_WhenTeamNotFound()
        {
            // Arrange
            var command = new RemoveZoneFromTeamCommand(zoneId: 5, teamId: 1);
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Domain.Entities.DeliveryTeam?)null);

            // Act
            var result = await _handler.RemoveZoneAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
           
        }

        [Fact(DisplayName = "Debe retornar false cuando la zona no está asignada al equipo")]
        public async Task RemoveZoneAsync_ReturnsFalse_WhenZoneNotAssigned()
        {
            // Arrange
            var team = new Domain.Entities.DeliveryTeam("Team A");
            var command = new RemoveZoneFromTeamCommand(zoneId: 99, teamId: 1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(team);

            // Act
            var result = await _handler.RemoveZoneAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);            
        }

        [Fact(DisplayName = "Debe eliminar la zona asignada y retornar true")]
        public async Task RemoveZoneAsync_ReturnsTrue_WhenZoneIsRemoved()
        {
            // Arrange
            var team = new Domain.Entities.DeliveryTeam("Team A");

            // Simula que tiene una zona asignada
            team.AssignZone(10);

            var command = new RemoveZoneFromTeamCommand(zoneId: 10, teamId: 1);

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(team);

            // Act
            var result = await _handler.RemoveZoneAsync(command);

            // Assert
            Assert.True(result);
            Assert.Empty(team.ZoneAssignments);

            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);
            
        }
    }
}
