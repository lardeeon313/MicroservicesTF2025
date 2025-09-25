using DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam;
using DepotService.Domain.Entities;
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

namespace DepotService.Test.Commands.DepotManager
{
    /// <summary>
    /// Test unitario para el handler RemoveOperatorCommandHandler.
    /// </summary>
    public class RemoveOperatorHandlerTest
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<ILogger<RemoveOperatorCommandHandler>> _loggerMock;
        private readonly RemoveOperatorCommandHandler _handler;

        public RemoveOperatorHandlerTest()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _loggerMock = new Mock<ILogger<RemoveOperatorCommandHandler>>();

            _handler = new RemoveOperatorCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Test que verifica que se remueve correctamente un operario de un equipo cuando existe.
        /// </summary>
        [Fact]
        public async Task RemoveOperator_ShouldRemoveOperator_WhenExistsInTeam()
        {
            // Arrange
            var team = new DepotTeamEntity("Team X", "Equipo de prueba");
            var operatorId = Guid.NewGuid();
            team.AssignOperator(operatorId);

            var command = new RemoveOperatorCommand(operatorId, team.Id);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            Func<Task> act = async () => await _handler.RemoveOperatorAsync(command);

            // Assert
            await act.Should().NotThrowAsync();

            team.Assignments.Should().NotContain(a => a.OperatorUserId == command.OperatorUserId);

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        /// <summary>
        /// ❌ Test que verifica que si el equipo no existe, lanza una excepción.
        /// </summary>
        [Fact]
        public async Task RemoveOperator_ShouldThrow_WhenTeamNotFound()
        {
            // Arrange
            var command = new RemoveOperatorCommand(Guid.NewGuid(), 999);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((DepotTeamEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.RemoveOperatorAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Team with ID {command.TeamId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }

        /// <summary>
        /// ❌ Test que verifica que si el operario no está en el equipo, lanza una excepción.
        /// </summary>
        [Fact]
        public async Task RemoveOperator_ShouldThrow_WhenOperatorNotInTeam()
        {
            // Arrange
            var team = new DepotTeamEntity("Team X", "Equipo de prueba");

            var command = new RemoveOperatorCommand(Guid.NewGuid(), team.Id);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            // Act
            Func<Task> act = async () => await _handler.RemoveOperatorAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Operator with UserId {command.OperatorUserId} not found in team {command.TeamId}.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
