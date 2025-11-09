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
            // Obtenemos solo órdenes entregadas
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
                .Where(o => o.Status == OrderStatus.Delivered)
                .ToList();

            // Obtener operadores desde IdentityService
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            // Crear diccionario para búsqueda rápida
            var operatorsById = deliveryOperators.ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            // Agrupar por operador y zona
            var grouped = deliveredOrders
                .GroupBy(o => new
                {
                    o.AssignedOperatorId,
                    o.AssignedDeliveryZoneId,
                    ZoneName = o.AssignedDeliveryZone?.Name
                })
                .Select(g =>
                {
                    string fullName = string.Empty;

                    if (g.Key.AssignedOperatorId.HasValue)
                    {
                        var opId = g.Key.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                        if (operatorsById.TryGetValue(opId, out var op))
                            fullName = op.FullName;
                    }

                    return new DeliveryTimeReportDto
                    {
                        OperatorId = g.Key.AssignedOperatorId,
                        FullNameDeliveringOperator = fullName,
                        DeliveryZoneId = g.Key.AssignedDeliveryZoneId,
                        DeliveryZoneName = g.Key.ZoneName,
                        TotalDeliveredOrders = g.Count(),
                        AverageDeliveryTimeInHours = g.Average(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours),
                        MaxDeliveryTimeInHours = g.Max(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours),
                        MinDeliveryTimeInHours = g.Min(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours)
                    };
                })
                .OrderBy(r => r.DeliveryZoneName)
                .ToList();

            _logger.LogInformation("Generated DeliveryTime report with {Count} entries", grouped.Count);

            return grouped;
        }    
    }
}
