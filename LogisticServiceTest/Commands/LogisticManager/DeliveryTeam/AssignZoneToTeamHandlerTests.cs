using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam;
using LogisticService.Domain.Entities;
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
    public class AssignZoneToTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<AssignZoneToTeamCommandHandler>> _loggerMock;

        public AssignZoneToTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<AssignZoneToTeamCommandHandler>>();
        }

        private Domain.Entities.DeliveryTeam CreateTeam(int id, bool withZone = false, int zoneId = 0)
        {
            var team = new Domain.Entities.DeliveryTeam(id, "Moto", true);

            if (withZone)
            {
                team.ZoneAssignments.Add(new DeliveryTeamZoneAssignment
                {
                    DeliveryTeamId = id,
                    DeliveryZoneId = zoneId,
                    AssignedAt = DateTime.UtcNow
                });
            }

            return team;
        }

        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task AssignZone_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            var command = new AssignZoneToTeamCommand(99, 10);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((Domain.Entities.DeliveryTeam?)null);

            var handler = new AssignZoneToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignZoneToTeam(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        [Fact(DisplayName = "Debe retornar false cuando la zona ya está asignada al equipo")]
        public async Task AssignZone_ShouldReturnFalse_WhenZoneAlreadyAssigned()
        {
            // Arrange
            int teamId = 1;
            int zoneId = 5;

            var command = new AssignZoneToTeamCommand(zoneId, teamId);

            var existingTeam = CreateTeam(teamId, withZone: true, zoneId: zoneId);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(existingTeam);

            var handler = new AssignZoneToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignZoneToTeam(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        [Fact(DisplayName = "Debe asignar la zona al equipo cuando no está asignada")]
        public async Task AssignZone_ShouldAssignZone_WhenNotAssigned()
        {
            // Arrange
            int teamId = 1;
            int zoneId = 7;

            var command = new AssignZoneToTeamCommand(zoneId, teamId);

            var team = CreateTeam(teamId);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(team);

            var handler = new AssignZoneToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignZoneToTeam(command);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);

            Assert.Contains(team.ZoneAssignments, z => z.DeliveryZoneId == zoneId);
        }
    }
}
