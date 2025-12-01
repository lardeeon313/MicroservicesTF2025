using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveOperatorToTeam;
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
    public class RemoveOperatorToTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<RemoveOperatorToTeamCommandHandler>> _loggerMock;

        public RemoveOperatorToTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<RemoveOperatorToTeamCommandHandler>>();
        }

        // --------------------------------------------------------------------
        [Fact(DisplayName = "Debe remover el operador cuando existe en el equipo")]
        public async Task RemoveOperator_ShouldRemove_WhenOperatorExistsInTeam()
        {
            // Arrange
            int teamId = 1;
            Guid operatorId = Guid.NewGuid();

            var team = new LogisticService.Domain.Entities.DeliveryTeam("Team A", "Test");
            team.AssignOperator(operatorId); // operador asignado

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(team);

            _repositoryMock
                .Setup(r => r.UpdateAsync(team))
                .Returns(Task.CompletedTask);

            var handler = new RemoveOperatorToTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new RemoveOperatorToTeamCommand(operatorId, teamId);

            // Act
            var result = await handler.RemoveOperatorAsync(command);

            // Assert
            Assert.True(result);
            Assert.DoesNotContain(team.DeliveryOperators, x => x.OperatorUserId == operatorId);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);
        }

        // --------------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task RemoveOperator_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            int teamId = 999;
            Guid operatorId = Guid.NewGuid();

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync((LogisticService.Domain.Entities.DeliveryTeam?)null);

            var handler = new RemoveOperatorToTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new RemoveOperatorToTeamCommand(operatorId, teamId);

            // Act
            var result = await handler.RemoveOperatorAsync(command);

            // Assert
            Assert.False(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<LogisticService.Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        // --------------------------------------------------------------------
        [Fact(DisplayName = "Debe retornar false cuando el operador no está asignado al equipo")]
        public async Task RemoveOperator_ShouldReturnFalse_WhenOperatorNotInTeam()
        {
            // Arrange
            int teamId = 5;
            Guid operatorId = Guid.NewGuid();

            var team = new LogisticService.Domain.Entities.DeliveryTeam("Team Z", "Test");

            // equipo sin operadores
            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(team);

            var handler = new RemoveOperatorToTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            var command = new RemoveOperatorToTeamCommand(operatorId, teamId);

            // Act
            var result = await handler.RemoveOperatorAsync(command);

            // Assert
            Assert.False(result);

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<LogisticService.Domain.Entities.DeliveryTeam>()), Times.Never);
        }
    }
}
