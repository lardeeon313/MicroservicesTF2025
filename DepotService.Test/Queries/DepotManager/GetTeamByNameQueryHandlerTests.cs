using DepotService.Application.Queries.DepotManager.GetTeamByName;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Queries.DepotManager
{
    public class GetTeamByNameQueryHandlerTests
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly DepotDbContext _context; // Si no usas en el handler, puedes pasar null
        private readonly GetTeamByNameQueryHandler _handler;

        public GetTeamByNameQueryHandlerTests()
        {
            _repositoryMock = new Mock<ITeamRepository>();
            _context = null; // Pasa null o un mock si es necesario
            _handler = new GetTeamByNameQueryHandler(_repositoryMock.Object, _context);
        }

        [Fact]
        public async Task GetTeamByNameHandler_ShouldReturnTeamDto_WhenTeamExists()
        {
            // Arrange
            var teamName = "Team Bravo";
            var teamEntity = new DepotTeamEntity
            {
                Id = 2,
                TeamName = teamName,
                TeamDescription = "Description Bravo",
                Assignments = new List<DepotTeamAssignment>
            {
                new DepotTeamAssignment
                {
                    OperatorUserId = Guid.NewGuid(),
                    AssignedAt = DateTime.UtcNow.AddDays(-2),
                    RoleInTeam = "Member"
                }
            }
            };

            _repositoryMock.Setup(r => r.GetByNameAsync(teamName))
                .ReturnsAsync(teamEntity);

            var query = new GetTeamByNameQuery(teamName);

            // Act
            var result = await _handler.GetTeamByNameHandler(query);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(teamEntity.Id);
            result.TeamName.Should().Be(teamName);
            result.TeamDescription.Should().Be("Description Bravo");
            result.Operators.Should().HaveCount(1);
            result.Operators[0].RoleInTeam.Should().Be("Member");
        }

        [Fact]
        public async Task GetTeamByNameHandler_ShouldThrowKeyNotFoundException_WhenTeamDoesNotExist()
        {
            // Arrange
            var teamName = "NonExistentTeam";

            _repositoryMock.Setup(r => r.GetByNameAsync(teamName))
                .ReturnsAsync((DepotTeamEntity)null);

            var query = new GetTeamByNameQuery(teamName);

            // Act
            Func<Task> act = async () => await _handler.GetTeamByNameHandler(query);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Team with name {teamName} not found.");
        }
    }
}
