using DepotService.Application.DTOs.DepotManager;
using DepotService.Application.DTOs.DepotOperator;
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
            if (teams == null)
                return new List<DepotTeamDto>();

            var depotOperators = await identityServiceClient.GetUserWithRoleOperator()
                ?? new List<DepotOperatorsDto>();

            var operatorsById = depotOperators.Count > 0
                ? depotOperators.ToDictionary(op => op.Id.ToLowerInvariant())
                : new Dictionary<string, DepotOperatorsDto>();

            return teams.Select(t => new DepotTeamDto
            {
                Id = t.Id,
                TeamName = t.TeamName,
                TeamDescription = t.TeamDescription,
                CreatedAt = t.CreatedAt,
                Operators = t.Assignments
                    .Where(a => operatorsById.ContainsKey(a.OperatorUserId.ToString().ToLowerInvariant()))
                    .Select(a =>
                    {
                        var operatorData = operatorsById[a.OperatorUserId.ToString().ToLowerInvariant()];
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