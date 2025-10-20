using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamByName
{
    public class GetTeamByNameQueryHandler(ITeamRepository repository, ILogger<GetTeamByNameQueryHandler> logger) : IGetTeamByNameQueryHandler
    {
        private readonly ILogger<GetTeamByNameQueryHandler> _logger = logger;
        private readonly ITeamRepository _repository = repository;        

        /// <summary>
        /// Handler for retrieving a team by its name.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<DepotTeamDto?> GetTeamByNameHandler(GetTeamByNameQuery query)
        {
            // Validate the query input
            var team = await _repository.GetByNameAsync(query.TeamName);

            // Check if the team exists
            if (team == null)
            {
                _logger.LogInformation("No team found with the name {TeamName}.", query.TeamName);
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
