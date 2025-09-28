using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetAllTeams
{
    public class GetAllTeamsQueryHandler(IDeliveryTeamRepository repository, IIdentityServiceClient serviceClient, ILogger<GetAllTeamsQueryHandler> logger) : IGetAllTeamsQueryHandler
    {
        private readonly ILogger<GetAllTeamsQueryHandler> _logger = logger;
        private readonly IDeliveryTeamRepository _repository = repository;
        private readonly IIdentityServiceClient _serviceClient = serviceClient;

        /// <summary>
        /// Query para devolver una lista de equipos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<DeliveryTeamDto>> HandleAsync()
        {
            var teams = await _repository.GetAllAsync();
            if (teams == null || !teams.Any())
            {
                _logger.LogWarning("No delivery teams found in the system.");
                return Enumerable.Empty<DeliveryTeamDto>();
            }

            var deliveryOperators = await _serviceClient.GetUserWithRoleDeliveryOperator();
            if (deliveryOperators == null || !deliveryOperators.Any())
            {
                _logger.LogWarning("No delivery operators found in the identity service.");
                return teams.Select(t => new DeliveryTeamDto
                {
                    Id = t.Id,
                    TeamName = t.TeamName,
                    TeamDescription = t.TeamDescription,
                    CreatedAt = t.CreatedAt,
                    IsActive = t.IsActive,
                    Operators = [],
                    ZoneAssignments = t.ZoneAssignments
                        .Where(z => z.IsActive)
                        .Select(z => new DeliveryZoneDto
                        {
                            Id = z.DeliveryZone.Id,
                            Name = z.DeliveryZone.Name,
                            Description = z.DeliveryZone.Description
                        }).ToList()
                });
            }

            var operatorsById = deliveryOperators.ToDictionary(op => op.Id.ToLower());

            return teams.Select(team => new DeliveryTeamDto
            {
                Id = team.Id,
                TeamName = team.TeamName,
                TeamDescription = team.TeamDescription,
                CreatedAt = team.CreatedAt,
                IsActive = team.IsActive,
                Operators = team.DeliveryOperators
                    .Where(m => operatorsById.ContainsKey(m.OperatorUserId.ToString().ToLower()))
                    .Select(m =>
                    {
                        var operatorData = operatorsById[m.OperatorUserId.ToString().ToLower()];
                        return new DeliveryOperatorsInTeamDto
                        {
                            OperatorByUserId = m.OperatorUserId,
                            AssignAt = m.AssignedAt,
                            RoleInTeam = m.RoleInTeam,
                            FirstName = operatorData.FirstName,
                            LastName = operatorData.LastName,
                            PhoneNumber = operatorData.PhoneNumber,
                            Email = operatorData.Email
                        };
                    }).ToList(),

                ZoneAssignments = team.ZoneAssignments
                    .Where(z => z.IsActive) // 👈 solo zonas activas
                    .Select(z => new DeliveryZoneDto
                    {
                        Id = z.DeliveryZone.Id,
                        Name = z.DeliveryZone.Name,
                        Description = z.DeliveryZone.Description
                    }).ToList()

            }).ToList();
        }

    }
}
