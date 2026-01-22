using DepotService.Application.DTOs.Reports;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetDepotTeamPerformance
{
    public class GetDepotTeamPerformanceQueryHandler(IDepotReportRepository repository, IIdentityServiceClient identityServiceClient) : IGetDepotTeamPerformanceQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository;
        private readonly IIdentityServiceClient _identity = identityServiceClient;

        /// <summary>
        /// Handler for the GetDepotTeamPerformanceQuery.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<DepotTeamPerformanceDto>> HandleAsync(GetDepotTeamPerformanceQuery request)
        {
            var raw = await _repository.GetDepotTeamPerformancesAsync(
            request.From, request.To,
            request.AgruparPorEquipo);

            // Obtener operadores desde el Identity
            var allOps = await _identity.GetUserWithRoleOperator() ?? [];

            var opsDict = allOps.ToDictionary(
                x => x.Id.ToLowerInvariant(),
                x => $"{x.FirstName} {x.LastName}"
            );

            return raw.Select(x =>
            {
                string name;

                if (x.IsTeam)
                {
                    name = x.TeamName ?? "N/A";
                }
                else
                {
                    // Si OperatorId viene null, evitamos el crash y warning
                    var opId = x.OperatorId?.ToString().ToLowerInvariant();

                    name = (opId != null && opsDict.TryGetValue(opId, out var n))
                        ? n
                        : "N/A";
                }

                return new DepotTeamPerformanceDto
                {
                    DepotTeamId = x.IsTeam ? x.DepotTeamId : null,
                    Name = name,
                    OrdersHandled = x.OrdersHandled,
                    MissingItemsReported = x.MissingItemsReported,
                    IsTeam = x.IsTeam,
                    OperatorId = x.OperatorId
                };
            })
            .OrderByDescending(x => x.IsTeam)
            .ThenBy(x => x.Name)
            .ToList();
        }
    }
}
