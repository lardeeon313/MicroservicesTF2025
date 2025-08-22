using DepotService.Application.DTOs.DepotManager;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllTeams
{
    public class GetAllTeamsQueryHandler(ITeamRepository repository, IIdentityServiceClient identityClient) : IGetAllTeamsQueryHandler
    {
        private readonly ITeamRepository _repository = repository;
        private readonly IIdentityServiceClient identityServiceClient = identityClient;

        public async Task<IEnumerable<DepotTeamDto>> HandleAsync()
        {
            var teams = await _repository.GetAllAsync();
            var depotOperators = await identityServiceClient.GetUserWithRoleOperator();

            // Check if depotOperators is null or empty
            if (depotOperators == null || !depotOperators.Any())
                throw new Exception("No operators found in Identity Service");

            // Debug: Mostramos los IDs de los operadores
            Console.WriteLine("IDs de operadores obtenidos:");
            foreach (var operatorDto in depotOperators)
            {
                Console.WriteLine($"  -> {operatorDto.Id}");
            }

            // Check if teams are null or empty
            if (teams == null)
                throw new Exception("No teams found");

            var operatorsById = depotOperators.ToDictionary(op => op.Id.ToLower());

            // Project to DTO
            return teams.Select(t => new DepotTeamDto
            {
                Id = t.Id,
                TeamName = t.TeamName,
                TeamDescription = t.TeamDescription,
                CreatedAt = t.CreatedAt,
                Operators = t.Assignments
                    .Where(a => operatorsById.ContainsKey(a.OperatorUserId.ToString().ToLower()))
                    .Select(a =>
                    {
                        var operatorData = operatorsById[a.OperatorUserId.ToString().ToLower()];
                        return new OperatorsInTeamDto
                        {
                            OperatorByUserId = a.OperatorUserId,
                            AssignAt = a.AssignedAt,
                            RoleInTeam = a.RoleInTeam,
                            FirstName = operatorData?.FirstName,
                            LastName = operatorData?.LastName,
                            PhoneNumber = operatorData?.PhoneNumber,
                            Email = operatorData?.Email
                        };
                    }).ToList()
            }).ToList();
        }
    }
}
