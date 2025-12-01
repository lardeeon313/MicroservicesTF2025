using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
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
    public class ActiveDeliveryTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<ActiveDeliveryTeamCommandHandler>> _loggerMock;

        private readonly ActiveDeliveryTeamCommandHandler _handler;

        public ActiveDeliveryTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<ActiveDeliveryTeamCommandHandler>>();

            _handler = new ActiveDeliveryTeamCommandHandler(
                _repositoryMock.Object,
                _loggerMock.Object
            );
        }

        // ========================================================================
        [Fact(DisplayName = "Debe retornar false cuando el equipo no existe")]
        public async Task Should_ReturnFalse_WhenTeamNotFound()
        {
            var command = new ActiveDeliveryTeamCommand(5);

            _repositoryMock.Setup(r => r.GetByIdAsync(5))
                .ReturnsAsync((Domain.Entities.DeliveryTeam?)null);

            var result = await _handler.HandleAsync(command);

            Assert.False(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }
        // ========================================================================

        [Fact(DisplayName = "Debe retornar true cuando el equipo ya está activo")]
        public async Task Should_ReturnTrue_WhenTeamAlreadyActive()
        {
            var team = new Domain.Entities.DeliveryTeam { Id = 3, IsActive = true };

            var command = new ActiveDeliveryTeamCommand(3);

            _repositoryMock.Setup(r => r.GetByIdAsync(3)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.True(result);
            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Never);
        }
        // ========================================================================

        [Fact(DisplayName = "Debe activar el equipo cuando está inactivo")]
        public async Task Should_ActivateTeam_WhenInactive()
        {
            var team = new Domain.Entities.DeliveryTeam { Id = 8, IsActive = false };

            var command = new ActiveDeliveryTeamCommand(8);

            _repositoryMock.Setup(r => r.GetByIdAsync(8)).ReturnsAsync(team);

            var result = await _handler.HandleAsync(command);

            Assert.True(result);
            Assert.True(team.IsActive, "El equipo debería haber sido activado por el método de dominio.");

            _repositoryMock.Verify(r => r.UpdateAsync(team), Times.Once);
        }
        // ========================================================================

        [Fact(DisplayName = "Debe llamar a UpdateAsync exactamente una vez cuando se activa el equipo")]
        public async Task Should_CallUpdateOnce_WhenActivatingTeam()
        {
            var team = new Domain.Entities.DeliveryTeam { Id = 2, IsActive = false };

            _repositoryMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(team);

            var command = new ActiveDeliveryTeamCommand(2);

            await _handler.HandleAsync(command);

            _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Once);
        }
    }
}
