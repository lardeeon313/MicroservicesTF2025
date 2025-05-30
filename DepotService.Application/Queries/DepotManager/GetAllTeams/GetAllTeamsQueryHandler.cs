using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllTeams
{
    public class GetAllTeamsQueryHandler(ITeamRepository repository, DepotDbContext context) : IGetAllTeamsQueryHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        public async Task<IEnumerable<DepotTeamDto>> HandleAsync()
        {
            var teams = await _repository.GetAllAsync();
             
            if (teams == null)
                throw new Exception("No teams found");

            // Project to DTO
            return teams.Select(t => new DepotTeamDto
            {
                Id = t.Id,
                TeamName = t.TeamName,
                TeamDescription = t.TeamDescription,
                CreatedAt = t.CreatedAt,
            }).ToList();

        }
    }
}
