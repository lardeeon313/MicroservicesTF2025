using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTeamActivityReport
{
    public class GetDeliveryTeamActivityReportQueryHandler(ILogisticReportRepository repository, ILogger<GetDeliveryTeamActivityReportQueryHandler> logger) : IGetDeliveryTeamActivityReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryTeamActivityReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de productividad de los equipos, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>   
        public async Task<IEnumerable<TeamActivityReportDto>> HandleAsync(GetDeliveryTeamActivityReportQuery query)
        {
            var results = await _repository.GetDeliveryTeamActivityAsync(
            query.StartDate,
            query.EndDate,
            query.DeliveryTeamId,
            query.DeliveryZoneId
        );

            _logger.LogInformation("Reporte de actividad de equipos generado con {Count} registros.", results.Count);

            return results.Select(r => new TeamActivityReportDto
            {
                DeliveryTeamId = r.DeliveryTeamId,
                TeamName = r.TeamName,
                TotalOrders = r.TotalOrders,
                DeliveredOrders = r.DeliveredOrders,
                OnTheWayOrders = r.OnTheWayOrders,
                PendingCashVerificationOrders  = r.PendingCashVerificationOrders,
                IncidentsCount = r.IncidentsCount,
                RejectionsCount = r.RejectionsCount,
                AverageDeliveryTimeHours = r.AverageDeliveryTimeHours,
                IncidentRatePercent = r.IncidentRatePercent,
                RejectionRatePercent = r.RejectionRatePercent,
                DeliverySuccessRatePercent = r.DeliverySuccessRatePercent
            }).ToList();
        }
    }
}
