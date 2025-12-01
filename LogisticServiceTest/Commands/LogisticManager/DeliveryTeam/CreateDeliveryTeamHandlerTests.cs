using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam;
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
    public class CreateDeliveryTeamHandlerTests
    {
        private readonly Mock<IDeliveryTeamRepository> _repositoryMock;
        private readonly Mock<ILogger<CreateDeliveryTeamCommandHandler>> _loggerMock;

        public CreateDeliveryTeamHandlerTests()
        {
            _repositoryMock = new Mock<IDeliveryTeamRepository>();
            _loggerMock = new Mock<ILogger<CreateDeliveryTeamCommandHandler>>();
        }

        [Fact(DisplayName = "Debe llamar a AddAsync con el equipo correcto al crear un Delivery Team")]
        public async Task CreateDeliveryTeam_ShouldCallAddAsync_WithCorrectTeam()
        {
            // Arrange
            var command = new CreateDeliveryTeamCommand("Team Alpha", "Equipo de prueba");

            Domain.Entities.DeliveryTeam? capturedTeam = null;

            _repositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Domain.Entities.DeliveryTeam>()))
                .Callback<Domain.Entities.DeliveryTeam>(team => capturedTeam = team)
                .Returns(Task.CompletedTask);

            var handler = new CreateDeliveryTeamCommandHandler(_repositoryMock.Object, _loggerMock.Object);

            // Act
            await handler.CreateDeliveryTeamAsync(command);

            // Assert
            _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Domain.Entities.DeliveryTeam>()), Times.Once);

            Assert.NotNull(capturedTeam);
            Assert.Equal(command.TeamName, capturedTeam!.TeamName);
            Assert.Equal(command.TeamDescription, capturedTeam.TeamDescription);
        }
    }
}
