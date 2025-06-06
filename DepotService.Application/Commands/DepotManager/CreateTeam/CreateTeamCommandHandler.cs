using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.DTOs.DepotManager.Response;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.CreateTeam
{
    /// <summary>
    /// handler para el comando CreateTeam.
    /// </summary>
    public class CreateTeamCommandHandler(ITeamRepository repository, DepotDbContext context, ILogger<CreateTeamCommandHandler> logger) : ICreateTeamCommandHandler
    {
        private readonly ITeamRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<CreateTeamCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger))  ;


        /// <summary>
        /// Maneja la creación de un equipo del sistema
        /// </summary>
        /// <param name="command">Datos para crear el equipo.</param>
        /// <exception cref="InvalidOperationException">Si el equipo ya existe.</exception>
        /// <returns></returns>
        public async Task<CreateTeamResponse> HandleAsync(CreateTeamCommand command)
        {
            var existingTeam = await _repository.GetByNameAsync(command.TeamName);
            if (existingTeam != null)
            {
                _logger.LogError("El equipo ya existe.");
                throw new InvalidOperationException($"El equipo {command.TeamName} ya existe.");
            }

            var newTeam = new DepotTeamEntity(command.TeamName, command.TeamDescription);
            await _repository.AddAsync(newTeam);

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Equipo {command.TeamName} creado con éxito.");

            return new CreateTeamResponse
            {
                TeamId = newTeam.Id,
                TeamName = newTeam.TeamName,
                TeamDescription = newTeam.TeamDescription,
                CreatedAt = DateTime.UtcNow,

            };
        }
    }
}
