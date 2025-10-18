using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamById
{
    public class GetTeamByIdQueryHandler(ITeamRepository repository, ILogger<GetTeamByIdQueryHandler> logger) : IGetTeamByIdQueryHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly ILogger<GetTeamByIdQueryHandler> _logger = logger;

        public async Task<DepotTeamDto> GetByIdHandle(GetTeamByIdQuery query)
        {
            var team = await _repository.GetByIdAsync(query.TeamId);
            if (team == null)
            {
                _logger.LogInformation($"Team with ID {query.TeamId} not found.");
                return null;
            }
            return new DepotTeamDto
            {
                Id = team.Id,
                TeamName = team.TeamName,
                TeamDescription = team.TeamDescription,
                Operators = team.Assignments.Select(o => new OperatorsInTeamDto
                {
                    OperatorByUserId = o.OperatorUserId,
                    AssignAt = o.AssignedAt,
                    RoleInTeam = o.RoleInTeam,
                }).ToList(),
            };

        }
    }
}
