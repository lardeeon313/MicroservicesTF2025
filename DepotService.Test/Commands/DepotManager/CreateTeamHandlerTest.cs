using DepotService.Application.Commands.DepotManager.CreateTeam;
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
    /// <summary>
    /// Tests unitarios para el comando CreateTeamCommandHandler.
    /// </summary>
    public class CreateTeamHandlerTest
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly Mock<ILogger<CreateTeamCommandHandler>> _loggerMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly CreateTeamCommandHandler _handler;

        public CreateTeamHandlerTest()
        {
            // Mockeamos las dependencias necesarias
            _repositoryMock = new Mock<ITeamRepository>();
            _loggerMock = new Mock<ILogger<CreateTeamCommandHandler>>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());

            // Instanciamos el handler con los mocks
            _handler = new CreateTeamCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object,
                _loggerMock.Object
            );
        }

        /// <summary>
        /// ✅ Este test verifica que el equipo se cree correctamente
        /// cuando no existe previamente en la base de datos.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldCreateTeam_WhenTeamDoesNotExist()
        {
            // Arrange (preparamos los datos y comportamiento de los mocks)
            var command = new CreateTeamCommand("Equipo Alpha", "Equipo de operaciones");

            _repositoryMock.Setup(r => r.GetByNameAsync(command.TeamName))
                .ReturnsAsync((DepotTeamEntity?)null); // Simula que el equipo NO existe

            _repositoryMock.Setup(r => r.AddAsync(It.IsAny<DepotTeamEntity>()))
                .Returns(Task.CompletedTask);

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act (ejecutamos el handler)
            var result = await _handler.HandleAsync(command);

            // Assert (verificamos resultados)
            result.Should().NotBeNull();
            result.TeamName.Should().Be(command.TeamName);
            result.TeamDescription.Should().Be(command.TeamDescription);
            result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

            _repositoryMock.Verify(r => r.GetByNameAsync(command.TeamName), Times.Once);
            _repositoryMock.Verify(r => r.AddAsync(It.Is<DepotTeamEntity>(t =>
                t.TeamName == command.TeamName &&
                t.TeamDescription == command.TeamDescription
            )), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        /// <summary>
        /// ❌ Este test verifica que si el equipo ya existe,
        /// se lanza una excepción InvalidOperationException.
        /// </summary>
        [Fact]
        public async Task HandleAsync_ShouldThrow_WhenTeamAlreadyExists()
        {
            // Arrange (simula un equipo existente)
            var command = new CreateTeamCommand("Equipo Beta", "Equipo logístico");
            var existingTeam = new DepotTeamEntity(command.TeamName, command.TeamDescription);

            _repositoryMock.Setup(r => r.GetByNameAsync(command.TeamName))
                .ReturnsAsync(existingTeam); // Simula que el equipo ya existe

            // Act (ejecutamos el handler y capturamos la excepción)
            Func<Task> act = async () => await _handler.HandleAsync(command);

            // Assert (verificamos que lanza la excepción esperada)
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage($"El equipo {command.TeamName} ya existe.");

            _repositoryMock.Verify(r => r.GetByNameAsync(command.TeamName), Times.Once);
            _repositoryMock.Verify(r => r.AddAsync(It.IsAny<DepotTeamEntity>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
