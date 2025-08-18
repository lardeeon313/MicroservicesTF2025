using DepotService.Application.Queries.DepotManager.GetAllTeams;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotManager
{
    public class GetAllTeamsQueryHandlerTests
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly GetAllTeamsQueryHandler _handler;

        private readonly Mock<IIdentityServiceClient> _identityClientMock;

        public GetAllTeamsQueryHandlerTests()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _identityClientMock = new Mock<IIdentityServiceClient>();
            _handler = new GetAllTeamsQueryHandler(
                repository: _repositoryMock.Object,
                identityClient: _identityClientMock.Object
            );
        }

        [Fact]
        public async Task HandleAsync_ShouldReturnListOfTeams_WhenTeamsExist()
        {
            // Arrange
            var teams = new List<DepotTeamEntity>
            {
                new DepotTeamEntity
                {
                    Id = 1,
                    TeamName = "Team A",
                    TeamDescription = "Description A",
                    CreatedAt = DateTime.UtcNow,
                    Assignments = new List<DepotTeamAssignment>
                    {
                        new DepotTeamAssignment
                        {
                            OperatorUserId = Guid.NewGuid(),
                            AssignedAt = DateTime.UtcNow,
                            RoleInTeam = "Leader"
                        }
                    }
                }
            };

            _repositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(teams);

            // Act
            var result = await _handler.HandleAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            var team = result.First();
            team.Id.Should().Be(1);
            team.TeamName.Should().Be("Team A");
            team.Operators.Should().HaveCount(1);
            team.Operators.First().RoleInTeam.Should().Be("Leader");
        }

        [Fact]
        public async Task HandleAsync_ShouldThrowException_WhenNoTeamsExist()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync((List<DepotTeamEntity>?)null);

            // Act
            var act = async () => await _handler.HandleAsync();

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("No teams found");
        }
    }
}
