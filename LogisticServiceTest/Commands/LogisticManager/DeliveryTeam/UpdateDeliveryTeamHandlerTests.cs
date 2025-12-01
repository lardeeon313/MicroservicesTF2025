using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam;
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
    public class UpdateDeliveryTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<UpdateDeliveryTeamCommandHandler>> _loggerMock;
        private readonly UpdateDeliveryTeamCommandHandler _handler;

        public UpdateDeliveryTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<UpdateDeliveryTeamCommandHandler>>();
            _handler = new UpdateDeliveryTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);
        }

        [Fact(DisplayName = "Debe lanzar KeyNotFoundException cuando el equipo no existe")]
        public async Task UpdateDeliveryTeamAsync_ThrowsKeyNotFound_WhenTeamDoesNotExist()
        {
            // Arrange
            var command = new UpdateDeliveryTeamCommand(id: 1, teamName: "Updated Name", teamDescription: "Updated Description");

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Domain.Entities.DeliveryTeam?)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.UpdateDeliveryTeamAsync(command));
            Assert.Contains("No se encontró el equipo de entrega", ex.Message);

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
            
        }

        [Fact(DisplayName = "Debe actualizar el equipo de entrega correctamente")]
        public async Task UpdateDeliveryTeamAsync_UpdatesTeamSuccessfully()
        {
            // Arrange
            var team = new Domain.Entities.DeliveryTeam("Original Name", "Original Description");

            var command = new UpdateDeliveryTeamCommand(
                id: 1,
                teamName: "New Team Name",
                teamDescription: "New Team Description"
            );

            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(team);

            // Act
            await _handler.UpdateDeliveryTeamAsync(command);

            // Assert
            Assert.Equal("New Team Name", team.TeamName);
            Assert.Equal("New Team Description", team.TeamDescription);

            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);            
        }
    }
}
