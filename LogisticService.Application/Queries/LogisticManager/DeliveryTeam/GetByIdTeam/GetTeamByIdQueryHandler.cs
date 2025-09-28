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

namespace LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetById
{
    public class GetTeamByIdQueryHandler(IDeliveryTeamRepository repository, IIdentityServiceClient identityClient, ILogger<GetTeamByIdQueryHandler> logger) : IGetTeamByIdQueryHandler
    {
        private readonly IDeliveryTeamRepository _repository = repository;
        private readonly ILogger<GetTeamByIdQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityClient = identityClient;

        /// <summary>
        /// Query para obtener un equipo de entrega por su Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<DeliveryTeamDto?> GetDeliveryTeam(int teamId)
        {
            // 1. Obtenemos el equipo
            var team = await _repository.GetByIdAsync(teamId);
            if (team == null)
            {
                _logger.LogWarning("Delivery team with Id {TeamId} not found.", teamId);
                return null;
            }

            // 2. Obtener operadores desde Identity Service
            var deliveryOperators = await _identityClient.GetUserWithRoleDeliveryOperator();
            var operatorsById = deliveryOperators.ToDictionary(op => op.Id.ToLower());

            // 3. Mapear equipo → DTO
            return new DeliveryTeamDto
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
                    .Where(z => z.IsActive)
                    .Select(z => new DeliveryZoneDto
                    {
                        Id = z.DeliveryZone.Id,
                        Name = z.DeliveryZone.Name,
                        Description = z.DeliveryZone.Description
                    }).ToList()
            };
        }
    }
}
