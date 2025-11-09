using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport
{
    public class GetOrderStatusHistoryReportQueryHandler(ILogisticReportRepository repository,
                                                         ILogger<GetOrderStatusHistoryReportQueryHandler> logger,
                                                         IIdentityServiceClient identityServiceClient) : IGetOrderStatusHistoryReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetOrderStatusHistoryReportQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;

        /// <summary>
        /// Genera el reporte del historial de movimientos de la orden por su estado, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>      
        public async Task<IEnumerable<OrderStatusHistoryReportDto>> HandleAsync(GetOrderStatusHistoryReportQuery query)
        {
            var results = await _repository.GetOrderStatusHistoryAsync(
                        query.StartDate,
                        query.EndDate,
                        query.OldStatus,
                        query.NewStatus,
                        query.OperatorId
                    );

            _logger.LogInformation("Reporte de flujo de estados generado con {Count} registros.", results.Count);

            // Obtener operadores desde IdentityService
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            // Crear diccionario de búsqueda rápida
            var operatorsById = deliveryOperators.ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            var reportList = results.Select(r =>
            {
                string fullName = string.Empty;

                if (r.AssignedOperatorId.HasValue)
                {
                    var opId = r.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                    if (operatorsById.TryGetValue(opId, out var op))
                        fullName = op.FullName;
                }

                return new OrderStatusHistoryReportDto
                {
                    Id = r.Id,
                    OrderId = r.OrderId,
                    CustomerName = r.CustomerName,
                    OldStatus = r.OldStatus,
                    NewStatus = r.NewStatus,
                    ChangedAt = r.ChangedAt,
                    AverageDurationSeconds = r.AverageDurationSeconds,
                    AssignedOperatorId = r.AssignedOperatorId,
                    FullNameDeliveringOperator = fullName,
                    AssignedTeamName = r.AssignedTeamName
                };
            }).ToList();

            return reportList;
        }
    }
}
