using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignOperatorToTeam;
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
    public class AssignOperatorToTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<AssignOperatorToTeamCommandHandler>> _loggerMock;

        public AssignOperatorToTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<AssignOperatorToTeamCommandHandler>>();
        }

        private Domain.Entities.DeliveryTeam CreateTeam(int id, bool withOperators = false, Guid? operatorId = null)
        {
            var team = new Domain.Entities.DeliveryTeam(id, "Moto", true);

            if (withOperators && operatorId.HasValue)
            {
                team.DeliveryOperators.Add(new DeliveryTeamMemberAssignment
                {
                    DeliveryTeamId = id,
                    OperatorUserId = operatorId.Value,
                    AssignedAt = DateTime.UtcNow,
                    RoleInTeam = "Delivery Operator"
                });
            }

            return team;
        }

        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task AssignOperator_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            var command = new AssignOperatorToTeamCommand(Guid.NewGuid(), 10);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((Domain.Entities.DeliveryTeam?)null);

            var handler = new AssignOperatorToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignOperatorAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        [Fact(DisplayName = "Debe retornar false cuando el operador ya está asignado al equipo")]
        public async Task AssignOperator_ShouldReturnFalse_WhenOperatorAlreadyAssigned()
        {
            // Arrange
            Guid operatorId = Guid.NewGuid();
            var command = new AssignOperatorToTeamCommand(operatorId, 1);

            var existingTeam = CreateTeam(1, withOperators: true, operatorId: operatorId);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(existingTeam);

            var handler = new AssignOperatorToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignOperatorAsync(command);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }

        [Fact(DisplayName = "Debe asignar el operador cuando el equipo existe y el operador no está asignado")]
        public async Task AssignOperator_ShouldAssignOperator_WhenTeamExistsAndOperatorNotAssigned()
        {
            // Arrange
            Guid operatorId = Guid.NewGuid();
            var command = new AssignOperatorToTeamCommand(operatorId, 2);

            var team = CreateTeam(2);

            _repositoryMock
                .Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(team);

            var handler = new AssignOperatorToTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            var result = await handler.AssignOperatorAsync(command);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);
        }
    }
}
