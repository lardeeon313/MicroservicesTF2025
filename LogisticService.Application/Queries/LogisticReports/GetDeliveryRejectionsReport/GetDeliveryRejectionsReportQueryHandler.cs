using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport
{
    public class GetDeliveryRejectionsReportQueryHandler(ILogisticReportRepository repository,
                                                         ILogger<GetDeliveryRejectionsReportQueryHandler> logger,
                                                         IIdentityServiceClient identityServiceClient) : IGetDeliveryRejectionsReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryRejectionsReportQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;

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

            // Obtener operadores desde el Identity Service
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            // Crear diccionario para búsqueda rápida
            var operatorsById = deliveryOperators
                .ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            // Mapear resultados 
            var result = rejections.Select(r =>
            {
                string fullName = string.Empty;
                var opId = r.DeliveryOperatorId.ToString().ToLowerInvariant();
                if (operatorsById.TryGetValue(opId, out var op))
                    fullName = op.FullName;

                return new DeliveryRejectionReportDto
                {
                    Id = r.Id,
                    LogisticOrderId = r.LogisticOrderId,
                    OperatorId = r.DeliveryOperatorId,
                    FullNameDeliveringOperator = fullName,
                    Reason = r.Reason,
                    RejectedAt = r.RejectedAt,
                    DeliveryZoneId = r.LogisticOrder.AssignedDeliveryZoneId,
                    DeliveryZoneName = r.LogisticOrder.AssignedDeliveryZone?.Name,
                    DeliveryTeamId = r.LogisticOrder.AssignedDeliveryTeamId,
                    DeliveryTeamName = r.LogisticOrder.AssignedDeliveryTeam?.TeamName,
                    CustomerName = $"{r.LogisticOrder.Customer?.FirstName ?? ""} {r.LogisticOrder.Customer?.LastName ?? ""}".Trim()
                };
            }).ToList();

            return result;
        }
    }
}
