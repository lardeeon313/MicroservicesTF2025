using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport
{
    public class GetDeliveryTimeReportQueryHandler : IGetDeliveryTimeReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository;
        private readonly ILogger<GetDeliveryTimeReportQueryHandler> _logger;
        private readonly IIdentityServiceClient _identityServiceClient;

        public GetDeliveryTimeReportQueryHandler(
            ILogisticReportRepository repository,
            ILogger<GetDeliveryTimeReportQueryHandler> logger,
            IIdentityServiceClient identityServiceClient)
        {
            _repository = repository;
            _logger = logger;
            _identityServiceClient = identityServiceClient;
        }

        public async Task<List<DeliveryTimeReportDto>> GetDeliveryTimeReportAsync(GetDeliveryTimeReportQuery query)
        {
            // 🔹 Normalización de fechas (incluye día completo)
            DateTime? startDate = query.StartDate?.Date;
            DateTime? endDate = query.EndDate?.Date.AddDays(1).AddTicks(-1);

            // 🔹 Obtener pedidos filtrados correctamente
            var orders = await _repository.GetFilteredOrdersAsync(
                startDate,
                endDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId,
                null
            );

            // 🔹 Solo pedidos entregados
            var deliveredOrders = orders
                .Where(o => o.Status == OrderStatus.Delivered)
                .ToList();

            // 🔹 Obtener repartidores
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            var operatorsById = deliveryOperators
                .ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            // 🔹 Construcción del reporte
            var report = deliveredOrders
                .Select(o =>
                {
                    string fullName = string.Empty;

                    if (o.AssignedOperatorId.HasValue)
                    {
                        var opKey = o.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                        if (operatorsById.TryGetValue(opKey, out var op))
                            fullName = op.FullName ?? string.Empty;
                    }

                    // 📅 Fecha pactada
                    DateTime? estimated = o.DeliveryDate;

                    // 📅 Fecha real de entrega (cuando pasó a Delivered)
                    DateTime? actual = o.StatusHistory
                        .Where(h => h.NewStatus == OrderStatus.Delivered)
                        .OrderBy(h => h.ChangedAt)
                        .Select(h => (DateTime?)h.ChangedAt)
                        .FirstOrDefault();

                    // Fallback defensivo
                    if (!actual.HasValue)
                        actual = estimated;

                    bool deliveredOnTime = false;
                    double? delayHours = null;

                    if (estimated.HasValue && actual.HasValue)
                    {
                        deliveredOnTime = actual.Value <= estimated.Value;
                        delayHours = (actual.Value - estimated.Value).TotalHours;
                    }

                    return new DeliveryTimeReportDto
                    {
                        OperatorId = o.AssignedOperatorId,
                        FullNameDeliveringOperator = fullName,

                        DeliveryZoneId = o.AssignedDeliveryZoneId,
                        DeliveryZoneName = o.AssignedDeliveryZone?.Name,

                        TeamId = o.AssignedDeliveryTeamId,
                        TeamName = o.AssignedDeliveryTeam?.TeamName,

                        TotalDeliveredOrders = 1,
                        EstimatedDeliveryDate = estimated,
                        ActualDeliveryDate = actual,
                        DeliveredOnTime = deliveredOnTime,
                        DelayInHours = delayHours,
                        OrderId = o.Id
                    };
                })
                .OrderBy(r => r.DeliveryZoneName)
                .ToList();

            _logger.LogInformation(
                "Generated DeliveryTime report with {Count} entries (StartDate: {StartDate}, EndDate: {EndDate})",
                report.Count,
                startDate,
                endDate
            );

            return report;
        }
    }
}
