using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.DeleteTeam
{
    /// <summary>
    /// Handler para eliminar un equipo.
    /// </summary>
    /// <param name="repository"></param>
    /// <param name="context"></param>
    public class DeleteTeamCommandHandler(ITeamRepository repository, DepotDbContext context) : IDeleteTeamCommandHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly DepotDbContext _context = context;

        public async Task<bool> DeleteTeamHandler(DeleteTeamCommand command)
        {
            var team = await _repository.GetByIdAsync(command.TeamId);
            if (team == null)
            {
                throw new ArgumentNullException(nameof(command.TeamId), "Team not found");
            }

            await _repository.DeleteAsync(team.Id);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
