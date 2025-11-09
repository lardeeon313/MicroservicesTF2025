
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
<<<<<<< HEAD
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
=======
                string fullNameDelivering = string.Empty;
                string fullNameReportedBy = string.Empty;

                // Operador asignado
                if (i.LogisticOrder.AssignedOperatorId.HasValue)
                {
                    var opId = i.LogisticOrder.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                    if (operatorsById.TryGetValue(opId, out var op))
                        fullNameDelivering = op.FullName;
                }

                // Operador que reportó
                var reportedId = i.ReportedByOperatorId.ToString().ToLowerInvariant();
                if (operatorsById.TryGetValue(reportedId, out var reporter))
                    fullNameReportedBy = reporter.FullName;

                return new DeliveryIncidentReportDto
                {
                    Id = i.Id,
                    LogisticOrderId = i.LogisticOrderId,
                    ReportedByOperatorId = i.ReportedByOperatorId,
                    AssignedOperatorId = i.LogisticOrder.AssignedOperatorId,
                    FullNameDeliveringOperator = fullNameDelivering,
                    FullNameReportedByOperator = fullNameReportedBy,
                    IncidentType = i.IncidentType.ToString(),
                    Description = i.Description,
                    ReportedAt = i.ReportedAt,
                    Resolved = i.Resolved,
                    ResolvedAt = i.ResolvedAt,
                    ResolutionNote = i.ResolutionNote,
                    DeliveryIncidentStatus = i.DeliveryIncidentStatus.ToString(),
                    DeliveryZoneId = i.LogisticOrder.AssignedDeliveryZoneId
                        ?? i.LogisticOrder.AssignedDeliveryTeam?.ZoneAssignments
                            ?.FirstOrDefault(a => a.IsActive)?.DeliveryZoneId,
                    DeliveryZoneName = i.LogisticOrder.AssignedDeliveryZone?.Name
                        ?? i.LogisticOrder.AssignedDeliveryTeam?.ZoneAssignments
                            ?.FirstOrDefault(a => a.IsActive)?.DeliveryZone?.Name,
                    DeliveryTeamId = i.LogisticOrder.AssignedDeliveryTeamId,
                    DeliveryTeamName = i.LogisticOrder.AssignedDeliveryTeam?.TeamName,
                    CustomerName = $"{i.LogisticOrder.Customer?.FirstName ?? ""} {i.LogisticOrder.Customer?.LastName ?? ""}".Trim()
                };
>>>>>>> bc72047 (Se modifica Repository de Reportes en Logistica para realizar pruebas de los campos Id Zone y Zone Name.)
            }).ToList();
        }
    }
}
