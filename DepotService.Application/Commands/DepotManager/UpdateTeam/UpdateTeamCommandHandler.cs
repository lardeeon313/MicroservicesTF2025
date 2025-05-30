using DepotService.Application.DTOs.DepotManager.Response;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.UpdateTeam
{
    public class UpdateTeamCommandHandler(ITeamRepository repository, DepotDbContext context) : IUpdateTeamCommandHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly DepotDbContext _context = context;


        /// <summary>
        /// Handler para actualizar un equipo.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<UpdateTeamResponse> UpdateTeamHandle(UpdateTeamCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId)
                ?? throw new ArgumentNullException(nameof(command.TeamId), "Team not found");

            team.UpdateTeam(command.TeamName, command.TeamDescription ?? team.TeamDescription);

            await _repository.UpdateAsync(team);
            await _context.SaveChangesAsync();

            return new UpdateTeamResponse
            {
                TeamId = team.Id,
                TeamName = team.TeamName,
                TeamDescription = team.TeamDescription,
            };  
        }
    }
}
