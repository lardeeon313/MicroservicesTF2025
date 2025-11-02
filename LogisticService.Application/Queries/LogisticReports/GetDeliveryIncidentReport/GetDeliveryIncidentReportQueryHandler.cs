
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport;
using LogisticService.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports
{
    public class GetDeliveryIncidentReportQueryHandler(ILogisticReportRepository repository, ILogger<GetDeliveryIncidentReportQueryHandler> logger) : IGetDeliveryIncidentReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryIncidentReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de los incidentes del reparto, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>          
        public async Task<List<DeliveryIncidentReportDto>> HandleAsync(GetDeliveryIncidentReportQuery query)
        {
            var incidents = await _repository.GetDeliveryIncidentsReportQuery(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId,
                query.Resolved
            );

            _logger.LogInformation("Se recuperaron {Count} incidencias para el reporte.", incidents.Count);

            return incidents.Select(i => new DeliveryIncidentReportDto
            {
                Id = i.Id,
                LogisticOrderId = i.LogisticOrderId,
                ReportedByOperatorId = i.ReportedByOperatorId,
                AssignedOperatorId = i.LogisticOrder.AssignedOperatorId,
                IncidentType = i.IncidentType.ToString(),
                Description = i.Description,
                ReportedAt = i.ReportedAt,
                Resolved = i.Resolved,
                ResolvedAt = i.ResolvedAt,
                ResolutionNote = i.ResolutionNote,
                DeliveryIncidentStatus = i.DeliveryIncidentStatus.ToString(),
                DeliveryZoneId = i.LogisticOrder.AssignedDeliveryZoneId,
                DeliveryZoneName = i.LogisticOrder.AssignedDeliveryZone?.Name,
                DeliveryTeamId = i.LogisticOrder.AssignedDeliveryTeamId,
                DeliveryTeamName = i.LogisticOrder.AssignedDeliveryTeam?.TeamName,                
                CustomerName = $"{i.LogisticOrder.Customer?.FirstName ?? ""} {i.LogisticOrder.Customer?.LastName ?? ""}".Trim()
            }).ToList();
        }
    }
}
