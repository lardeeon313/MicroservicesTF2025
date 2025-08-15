using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetDepotTeamPerformance
{
    public class GetDepotTeamPerformanceQueryHandler(IDepotReportRepository repository) : IGetDepotTeamPerformanceQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository;

        /// <summary>
        /// Handler for the GetDepotTeamPerformanceQuery.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<DepotTeamPerformanceDto>> HandleAsync(GetDepotTeamPerformanceQuery request)
        {
            var data = await _repository.GetDepotTeamPerformancesAsync(request.From, request.To);

            return data.Select(x => new DepotTeamPerformanceDto
            {
                DepotTeamId = x.DepotTeamId,
                TeamName = x.TeamName,
                OrdersHandled = x.OrdersHandled,
                MissingItemsReported = x.MissingItemsReported,
                AverageProcessingTimeMinutes = x.AverageProcessingTimeMinutes
            }).ToList();
        }
    }
}
