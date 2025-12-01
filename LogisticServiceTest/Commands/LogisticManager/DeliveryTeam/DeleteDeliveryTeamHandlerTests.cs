using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DeleteDeliveryTeam;
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
    public class DeleteDeliveryTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<DeleteDeliveryTeamCommandHandler>> _loggerMock;

        public DeleteDeliveryTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<DeleteDeliveryTeamCommandHandler>>();
        }

        // -------------------------------------------------------------
        [Fact(DisplayName = "Debe eliminar el equipo cuando existe")]
        public async Task DeleteDeliveryTeam_ShouldDelete_WhenTeamExists()
        {
            // Arrange
            int teamId = 10;

            var fakeTeam = new LogisticService.Domain.Entities.DeliveryTeam("Team X", "Test team");

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync(fakeTeam);

            _repositoryMock
                .Setup(r => r.DeleteAsync(teamId))
                .Returns(Task.CompletedTask);

            var handler = new DeleteDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            // Act
            await handler.DeleteDeliveryTeamAsync(teamId);

            // Assert
            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(teamId), Times.Once);
        }

        // -------------------------------------------------------------
        [Fact(DisplayName = "Debe lanzar excepción cuando el equipo no existe")]
        public async Task DeleteDeliveryTeam_ShouldThrow_WhenTeamDoesNotExist()
        {
            // Arrange
            int teamId = 999;

            _repositoryMock
                .Setup(r => r.GetByIdAsync(teamId))
                .ReturnsAsync((LogisticService.Domain.Entities.DeliveryTeam?)null);

            var handler = new DeleteDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                handler.DeleteDeliveryTeamAsync(teamId)
            );

            _repositoryMock.Verify(r => r.GetByIdAsync(teamId), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
        }
    }
}
