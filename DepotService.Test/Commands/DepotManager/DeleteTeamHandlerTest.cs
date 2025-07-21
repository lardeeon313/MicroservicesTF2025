using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Test.Commands.DepotManager
{
    /// <summary>
    /// Tests unitarios para el handler DeleteTeamCommandHandler.
    /// </summary>
    public class DeleteTeamHandlerTest
    {
        private readonly Mock<ITeamRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly DeleteTeamCommandHandler _handler;

        public DeleteTeamHandlerTest()
        {
            // Configuración de los mocks
            _repositoryMock = new Mock<ITeamRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());

            // Instancia del handler a testear
            _handler = new DeleteTeamCommandHandler(
                _repositoryMock.Object,
                _contextMock.Object
            );
        }

        /// <summary>
        /// ✅ Este test verifica que un equipo existente se elimine correctamente.
        /// </summary>
        [Fact]
        public async Task DeleteTeamHandler_ShouldDeleteTeam_WhenTeamExists()
        {
            // Arrange (preparamos los datos y mocks)
            var command = new DeleteTeamCommand(1);
            var existingTeam = new DepotTeamEntity("Equipo A", "Equipo operativo") { Id = 1 };

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync(existingTeam); // Simula que el equipo sí existe

            _repositoryMock.Setup(r => r.DeleteAsync(existingTeam.Id))
                .Returns(Task.CompletedTask); // Simula eliminación exitosa

            _contextMock.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act (ejecutamos el handler)
            var result = await _handler.DeleteTeamHandler(command);

            // Assert (verificamos los resultados)
            result.Should().BeTrue();

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(existingTeam.Id), Times.Once);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        /// <summary>
        /// ❌ Este test verifica que si el equipo no existe,
        /// se lanza una excepción ArgumentNullException.
        /// </summary>
        [Fact]
        public async Task DeleteTeamHandler_ShouldThrow_WhenTeamDoesNotExist()
        {
            // Arrange (preparamos un comando donde el equipo no existe)
            var command = new DeleteTeamCommand(99);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.TeamId))
                .ReturnsAsync((DepotTeamEntity?)null); // Simula que NO existe

            // Act (intentamos ejecutar y capturamos la excepción)
            Func<Task> act = async () => await _handler.DeleteTeamHandler(command);

            // Assert (esperamos que lance ArgumentNullException)
            await act.Should().ThrowAsync<ArgumentNullException>()
                .WithMessage("*Team not found*");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.TeamId), Times.Once);
            _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
            _contextMock.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
