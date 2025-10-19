using DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling;
using DepotService.Application.Queries.DepotManager.GetTeamById;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotManager
{
    public class GetTeamByIdQueryHandlerTests
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly GetTeamByIdQueryHandler _handler;
        private readonly Mock<ILogger<GetTeamByIdQueryHandler>> _loggerMock;

        public GetTeamByIdQueryHandlerTests()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _loggerMock = new Mock<ILogger<GetTeamByIdQueryHandler>>();            
            _handler = new GetTeamByIdQueryHandler(_repositoryMock.Object, (ILogger<GetTeamByIdQueryHandler>)_loggerMock);
        }

        [Fact]
        public async Task GetByIdHandle_ShouldReturnTeamDto_WhenTeamExists()
        {
            // Arrange
            var teamId = 1;
            var teamEntity = new DepotTeamEntity
            {
                Id = teamId,
                TeamName = "Team Alpha",
                TeamDescription = "Description Alpha",
                Assignments = new List<DepotTeamAssignment>
            {
                new DepotTeamAssignment
                {
                    OperatorUserId = Guid.NewGuid(),
                    AssignedAt = DateTime.UtcNow.AddDays(-1),
                    RoleInTeam = "Leader"
                }
            }
            };

            _repositoryMock.Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(teamEntity);

            var query = new GetTeamByIdQuery(teamId);

            // Act
            var result = await _handler.GetByIdHandle(query);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(teamId);
            result.TeamName.Should().Be("Team Alpha");
            result.TeamDescription.Should().Be("Description Alpha");
            result.Operators.Should().HaveCount(1);
            result.Operators[0].RoleInTeam.Should().Be("Leader");
        }

        [Fact]
        public async Task GetByIdHandle_ShouldThrowKeyNotFoundException_WhenTeamDoesNotExist()
        {
            // Arrange
            var teamId = 999;

            _repositoryMock.Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync((DepotTeamEntity?)null);

            var query = new GetTeamByIdQuery(teamId);

            // Act
            Func<Task> act = async () => await _handler.GetByIdHandle(query);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Team with ID {teamId} not found.");
        }
    }
}
