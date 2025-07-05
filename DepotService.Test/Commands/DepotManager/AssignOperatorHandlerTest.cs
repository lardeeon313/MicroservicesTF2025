using DepotService.Application.Commands.DepotManager.AssignOperator;
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
    public class AssignOperatorHandlerTest
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly Mock<ILogger<AssignOperatorCommandHandler>> _loggerMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly AssignOperatorCommandHandler _handler;

        public AssignOperatorHandlerTest()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _loggerMock = new Mock<ILogger<AssignOperatorCommandHandler>>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());

            _handler = new AssignOperatorCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object,
                _contextMock.Object
            );
        }

        [Fact]
        public async Task AssignOperator_ShouldAssign_WhenDataIsValid()
        {
            // Arrange
            var team = new DepotTeamEntity(1, "Equipo A");
            var command = new AssignOperatorCommand(Guid.NewGuid(), team.Id);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            _repositoryMock.Setup(r => r.UpdateAsync(team))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _handler.AssignOperatorAsync(command);

            // Assert
            result.Should().NotBeNull();
            result.TeamId.Should().Be(command.TeamId);
            result.OperatorUserId.Should().Be(command.OperatorUserId);
            result.AssignedAt.Should().BeOnOrAfter(DateTime.UtcNow.AddSeconds(-5));

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<DepotTeamEntity>()), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task AssignOperator_ShouldThrow_WhenTeamNotFound()
        {
            // Arrange
            var command = new AssignOperatorCommand(Guid.NewGuid(), 999);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((DepotTeamEntity?)null);

            // Act
            var act = async () => await _handler.AssignOperatorAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"The team with ID{command.TeamId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task AssignOperator_ShouldThrow_WhenOperatorAlreadyAssigned()
        {
            // Arrange
            var operatorId = Guid.NewGuid();
            var team = new DepotTeamEntity(1, "Equipo A");
            team.AssignOperator(operatorId);

            var command = new AssignOperatorCommand(operatorId, team.Id);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            // Act
            var act = async () => await _handler.AssignOperatorAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"The operator with UserId {command.OperatorUserId} is already assigned to team {command.TeamId}.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
