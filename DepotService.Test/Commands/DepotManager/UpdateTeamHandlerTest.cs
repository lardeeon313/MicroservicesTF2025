using DepotService.Application.Commands.DepotManager.UpdateTeam;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.DepotManager
{
    /// <summary>
    /// Test unitario para UpdateTeamCommandHandler.
    /// </summary>
    public class UpdateTeamHandlerTest
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly UpdateTeamCommandHandler _handler;

        public UpdateTeamHandlerTest()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _handler = new UpdateTeamCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object
            );
        }

        /// <summary>
        /// ✅ Test que verifica la actualización exitosa de un equipo cuando existe.
        /// </summary>
        [Fact]
        public async Task UpdateTeam_ShouldUpdateTeam_WhenTeamExists()
        {
            // Arrange
            var team = new DepotTeamEntity("Team Old", "Descripción vieja");

            var command = new UpdateTeamCommand(team.Id, "Team Updated", "Nueva descripción");

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _handler.UpdateTeamHandle(command);

            // Assert
            result.Should().NotBeNull();
            result.TeamId.Should().Be(team.Id);
            result.TeamName.Should().Be(command.TeamName);
            result.TeamDescription.Should().Be(command.TeamDescription);

            team.TeamName.Should().Be(command.TeamName);
            team.TeamDescription.Should().Be(command.TeamDescription);

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        /// <summary>
        /// ❌ Test que verifica que si el equipo no existe, lanza una excepción.
        /// </summary>
        [Fact]
        public async Task UpdateTeam_ShouldThrow_WhenTeamNotFound()
        {
            // Arrange
            var command = new UpdateTeamCommand(999, "Team", "Descripción");

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((DepotTeamEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.UpdateTeamHandle(command);

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithMessage("*Team not found*");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
