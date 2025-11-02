using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetZonePerformanceReport
{
    public class GetZonePerformanceReportQueryHandler(ILogisticReportRepository repository, ILogger<GetZonePerformanceReportQueryHandler> logger) : IGetZonePerformanceReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetZonePerformanceReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de productividad por zonas, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>   
        public async Task<IEnumerable<ZonePerformanceReportDto>> HandleAsync(GetZonePerformanceReportQuery query)
        {
            var results = await _repository.GetZonePerformanceAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId
            );

            _logger.LogInformation("Reporte de rendimiento por zonas generado con {Count} registros.", results.Count);
            return results.Select(result => new ZonePerformanceReportDto
            {
                DeliveryZoneId = result.DeliveryZoneId,
                DeliveryZoneName = result.DeliveryZoneName,
                TotalOrders = result.TotalOrders,
                DeliveredOrders = result.DeliveredOrders,
                IncidentsCount = result.IncidentsCount,
                RejectionsCount = result.RejectionsCount,
                AverageDeliveryTimeHours = result.AverageDeliveryTimeHours,
                IncidentRatePercent = result.IncidentRatePercent,
                RejectionRatePercent = result.RejectionRatePercent,
                TopTeamName = result.TopTeamName,
                TopTeamId = result.TopTeamId,
            }).ToList();

        }
    }
}
