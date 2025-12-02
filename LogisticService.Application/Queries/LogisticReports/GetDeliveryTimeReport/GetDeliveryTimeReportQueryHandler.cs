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
    public class GetDeliveryTimeReportQueryHandler(ILogisticReportRepository repository,
                                                   ILogger<GetDeliveryTimeReportQueryHandler> logger,
                                                   IIdentityServiceClient identityServiceClient)
        : IGetDeliveryTimeReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryTimeReportQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;

        public async Task<List<DeliveryTimeReportDto>> GetDeliveryTimeReportAsync(GetDeliveryTimeReportQuery query)
        {
            var orders = await _repository.GetFilteredOrdersAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId,
                null
            );

            var deliveredOrders = orders
                .Where(o => o.Status == OrderStatus.Delivered)
                .ToList();

            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            var operatorsById = deliveryOperators
                .ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            var report = deliveredOrders.Select(o =>
            {
                string fullName = string.Empty;
                if (o.AssignedOperatorId.HasValue)
                {
                    var opKey = o.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                    if (operatorsById.TryGetValue(opKey, out var op))
                        fullName = op.FullName ?? string.Empty;
                }

                DateTime? estimated = o.DeliveryDate; // nullable
                DateTime? actual = o.StatusHistory
                    .Where(h => h.NewStatus == OrderStatus.Delivered)
                    .OrderBy(h => h.ChangedAt)
                    .Select(h => (DateTime?)h.ChangedAt) // convertir a nullable
                    .FirstOrDefault();

                // Si no hay fecha real, fallback a estimada
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

            _logger.LogInformation("Generated DeliveryTime report with {Count} entries", report.Count);

            return report;
        }
    }
}
