using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport
{
    public class GetDeliveryRejectionsReportQueryHandler(ILogisticReportRepository repository, ILogger<GetDeliveryRejectionsReportQueryHandler> logger) : IGetDeliveryRejectionsReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryRejectionsReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de Rechazos de Asignacion, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>   
        public async Task<List<DeliveryRejectionReportDto>> HandleAsync(GetDeliveryRejectionsReportQuery query)
        {
            var rejections = await _repository.GetDeliveryRejectionsAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId                
            );

            _logger.LogInformation("Se recuperaron {Count} rechazos de entrega para el reporte.", rejections.Count);

            return rejections.Select(r => new DeliveryRejectionReportDto
            {
                Id = r.Id,
                LogisticOrderId = r.LogisticOrderId,
                OperatorId = r.DeliveryOperatorId,                                
                Reason = r.Reason,
                RejectedAt = r.RejectedAt,
                DeliveryZoneId = r.LogisticOrder.AssignedDeliveryZoneId,
                DeliveryZoneName = r.LogisticOrder.AssignedDeliveryZone?.Name,
                DeliveryTeamId = r.LogisticOrder.AssignedDeliveryTeamId,
                DeliveryTeamName = r.LogisticOrder.AssignedDeliveryTeam?.TeamName,
                CustomerName = $"{r.LogisticOrder.Customer?.FirstName ?? ""} {r.LogisticOrder.Customer?.LastName ?? ""}".Trim()
            }).ToList();
        }
    }
}
