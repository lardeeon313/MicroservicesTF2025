using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam
{
    public class RemoveOperatorCommandHandler(ITeamRepository repository, DepotDbContext context, ILogger<RemoveOperatorCommand> logger) : IRemoveOperatorCommandHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<RemoveOperatorCommand> _logger = logger;

        /// <summary>
        /// Maneja el comando para remover un operario de un equipo.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task RemoveOperatorAsync(RemoveOperatorCommand command)    
        {
            // Validación de parámetros
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError("❌ No se encontró el equipo con ID {TeamId}", command.TeamId);
                throw new KeyNotFoundException($"Team with ID {command.TeamId} not found.");
            }

            // Validar que el operario se encuentre en el equipo
            var operatorAssignment = team.Assignments.FirstOrDefault(a => a.OperatorUserId == command.OperatorUserId);
            if (operatorAssignment == null)
                throw new KeyNotFoundException($"Operator with UserId {command.OperatorUserId} not found in team {command.TeamId}.");

            // Remover el operario del equipo   
            team.RemoveOperator(command.OperatorUserId);

            // Actualizar el equipo en el repositorio
            await _repository.UpdateAsync(team);
            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            // Registro de información
            _logger.LogInformation("✅ Operario {OperatorUserId} removido del equipo {TeamId}", command.OperatorUserId, command.TeamId);

        }
    }
}
