using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport
{
    public class GetDeliveryTimeReportQueryHandler(ILogisticReportRepository repository, 
                                                   ILogger<GetDeliveryTimeReportQueryHandler> logger,
                                                   IIdentityServiceClient identityServiceClient) : IGetDeliveryTimeReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryTimeReportQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;

        /// <summary>
        /// Generar reporte de tiempos promedios de entrega de un repartidor
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<List<DeliveryTimeReportDto>> GetDeliveryTimeReportAsync(GetDeliveryTimeReportQuery query)
        {
            // Obtener órdenes con filtros
            var orders = await _repository.GetFilteredOrdersAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId,
                null
            );

            // Filtrar solo las entregadas
            var deliveredOrders = orders
                .Where(o => o.Status == OrderStatus.Delivered && o.AssignedOperatorId != null)
                .ToList();

            // Obtener operadores desde Identity
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            var operatorsById = deliveryOperators
                .ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            // Agrupar (igual que tenías)
            var grouped = deliveredOrders
                .GroupBy(o => new
                {
                    o.AssignedOperatorId,
                    o.AssignedDeliveryZoneId,
                    ZoneName = o.AssignedDeliveryZone?.Name,
                    TeamId = o.AssignedDeliveryTeamId,
                    TeamName = o.AssignedDeliveryTeam?.TeamName
                })
                .Select(g =>
                {
                    string fullName = string.Empty;

                    // Recuperar nombre del operador
                    if (g.Key.AssignedOperatorId.HasValue)
                    {
                        var opKey = g.Key.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                        if (operatorsById.TryGetValue(opKey, out var op))
                            fullName = op.FullName ?? string.Empty;
                    }

                    // Calcular fechas por grupo
                    var estimated = g.Select(o => o.DeliveryDate).FirstOrDefault();
                    var actual = g
                        .SelectMany(o => o.StatusHistory)
                        .Where(h => h.NewStatus == OrderStatus.Delivered)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => h.ChangedAt)
                        .FirstOrDefault();

                    bool deliveredOnTime = false;
                    double? delayHours = null;

                    if (estimated.HasValue && actual != default)
                    {
                        deliveredOnTime = actual <= estimated.Value;
                        delayHours = (actual - estimated.Value).TotalHours;
                    }

                    return new DeliveryTimeReportDto
                    {
                        OperatorId = g.Key.AssignedOperatorId,
                        FullNameDeliveringOperator = fullName,

                        DeliveryZoneId = g.Key.AssignedDeliveryZoneId,
                        DeliveryZoneName = g.Key.ZoneName,

                        TeamId = g.Key.TeamId,
                        TeamName = g.Key.TeamName,

                        TotalDeliveredOrders = g.Count(),

                        EstimatedDeliveryDate = estimated,
                        ActualDeliveryDate = actual == default ? null : actual,

                        DeliveredOnTime = deliveredOnTime,
                        DelayInHours = delayHours
                    };
                })
                .OrderBy(r => r.DeliveryZoneName)
                .ToList();

            _logger.LogInformation("Generated DeliveryTime report with {Count} entries", grouped.Count);

            return grouped;
        }
    }    
}

