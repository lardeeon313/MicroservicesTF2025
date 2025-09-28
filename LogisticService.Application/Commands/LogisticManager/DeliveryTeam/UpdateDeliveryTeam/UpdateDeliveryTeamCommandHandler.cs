using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam
{
    public class UpdateDeliveryTeamCommandHandler(IDeliveryTeamRepository repository, ILogger<UpdateDeliveryTeamCommandHandler> logger) : IUpdateDeliveryTeamCommandHandler
    {
        private readonly ILogger<UpdateDeliveryTeamCommandHandler> _logger = logger;
        private readonly IDeliveryTeamRepository _repository = repository;

        /// <summary>
        /// Maneja el comando para actualizar un equipo de entrega.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public async Task UpdateDeliveryTeamAsync(UpdateDeliveryTeamCommand command)
        {
            var existingTeam = await _repository.GetByIdAsync(command.Id);
            if (existingTeam == null)
            {
                _logger.LogWarning("No se encontró el equipo de entrega con ID {TeamId} para actualizar.", command.Id);
                throw new KeyNotFoundException($"No se encontró el equipo de entrega con ID {command.Id}.");
            }

            existingTeam.UpdateTeam(command.TeamName, command.TeamDescription);
            await _repository.UpdateAsync(existingTeam);
            _logger.LogInformation("Equipo de entrega con ID {TeamId} actualizado exitosamente.", command.Id);

            return;
        }
    }
}
