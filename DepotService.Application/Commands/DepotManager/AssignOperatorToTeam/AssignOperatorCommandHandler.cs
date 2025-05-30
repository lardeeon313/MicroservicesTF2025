using DepotService.Application.DTOs.DepotManager.Response;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOperator
{
    /// <summary>
    /// Handler para asignar un operador a un equipo.
    /// </summary>
    public class AssignOperatorCommandHandler(ITeamRepository repository, ILogger<AssignOperatorCommandHandler> logger, DepotDbContext context) : IAssignOperatorCommandHandler
    {
        private readonly ITeamRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<AssignOperatorCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        /// <summary>
        /// Asigna un operador a un equipo existente.
        /// </summary>
        /// <param name="command">Datos para la asignación.</param>
        /// <exception cref="KeyNotFoundException">Si el equipo no existe.</exception>
        public async Task<AssignOperatorResponse> AssignOperatorAsync(AssignOperatorCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                _logger.LogError($"The team with ID {command.TeamId} not found.");
                throw new InvalidOperationException($"The team with ID{command.TeamId} not found.");
            }

            if(team.Assignments.Any(a => a.OperatorUserId == command.OperatorUserId))
            {
                _logger.LogError($"The operator with UserId {command.OperatorUserId} is already assigned to team {command.TeamId}.");
                throw new InvalidOperationException($"The operator with UserId {command.OperatorUserId} is already assigned to team {command.TeamId}.");
            }

            team.AssignOperator(command.OperatorUserId);

            await _repository.UpdateAsync(team);
            await _context.SaveChangesAsync();


            return new AssignOperatorResponse
            {
                OperatorUserId = command.OperatorUserId,
                TeamId = command.TeamId,
                AssignedAt = DateTime.UtcNow,
            };
        }
    }
}
