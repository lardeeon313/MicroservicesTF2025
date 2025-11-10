using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetTeamByDeliveryOperator
{
    public class GetTeamByDeliveryOperatorQueryHandler(IDeliveryTeamRepository repository, ILogger<GetTeamByDeliveryOperatorQueryHandler> logger) : IGetTeamByDeliveryOperatorQueryHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository;
        private readonly ILogger<GetTeamByDeliveryOperatorQueryHandler> _logger = logger;

        /// <summary>
        /// Query para obtener un equipo de entrega por un operario asignado
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<DeliveryTeamDto?> HandleAsync(GetTeamByDeliveryOperatorQuery query)
        {
            var team = await _repository.GetTeamByOperatorAsync(query.DeliveryOperatorUserId);
            if (team == null)
            {
                _logger.LogWarning("No delivery team found for operator ID: {OperatorId}", query.DeliveryOperatorUserId);
                return null;
            }
            var teamDto = new DeliveryTeamDto
            {
                Id = team.Id,
                TeamName = team.TeamName,
                TeamDescription = team.TeamDescription,
                CreatedAt = team.CreatedAt,
                IsActive = team.IsActive,
                ZoneAssignments = team.ZoneAssignments
                    .Where(z => z.IsActive)
                    .Select(z => new DeliveryZoneDto
                    {
                        Id = z.DeliveryZone.Id,
                        Name = z.DeliveryZone.Name,
                        Description = z.DeliveryZone.Description
                    }).ToList()
            };
            return teamDto;

        }
    }
}
