using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetTeamByName
{
    public class GetTeamByNameQueryHandler(ITeamRepository repository, DepotDbContext context) : IGetTeamByNameQueryHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly DepotDbContext _context = context;

        /// <summary>
        /// Handler for retrieving a team by its name.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public async Task<DepotTeamDto> GetTeamByNameHandler(GetTeamByNameQuery query)
        {
            // Validate the query input
            var team = await _repository.GetByNameAsync(query.TeamName);

            // Check if the team exists
            if (team == null)
                throw new KeyNotFoundException($"Team with name {query.TeamName} not found.");

            return new DepotTeamDto
            {
                Id = team.Id,
                TeamName = team.TeamName,
                TeamDescription = team.TeamDescription,
                Operators = team.Assignments.Select(o => new OperatorInTeamDto
                {
                    OperatorByUserId = o.OperatorUserId,
                    AssignAt = o.AssignedAt,
                    RoleInTeam = o.RoleInTeam,

                }).ToList(),
            };
        }
    }
}
