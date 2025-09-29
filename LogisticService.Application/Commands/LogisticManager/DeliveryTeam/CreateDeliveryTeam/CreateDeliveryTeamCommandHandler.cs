using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam
{
    public class CreateDeliveryTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<CreateDeliveryTeamCommandHandler> logger) : ICreateDeliveryTeamCommandHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<CreateDeliveryTeamCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Maneja el comando para crear un nuevo equipo de entrega.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task CreateDeliveryTeamAsync(CreateDeliveryTeamCommand command)
        {
            // Ensure DeliveryTeam is correctly referenced as a class, not a namespace
            var newTeam = new LogisticService.Domain.Entities.DeliveryTeam(command.TeamName, command.TeamDescription);
            await _repository.AddAsync(newTeam);
            _logger.LogInformation("Nuevo equipo de entrega creado con ID {TeamId} y nombre {TeamName}", newTeam.Id, newTeam.TeamName);

            return;
        }
    }
}
