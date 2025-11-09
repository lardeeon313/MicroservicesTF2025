using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport;
using LogisticService.Application.Services.IdentityServiceClient;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport
{
    public class GetPendingCashVerificationReportQueryHandler(ILogisticReportRepository repository,
                                                              ILogger<GetPendingCashVerificationReportQueryHandler> logger,
                                                              IIdentityServiceClient identityServiceClient) : IGetPendingCashVerificationReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetPendingCashVerificationReportQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;

        /// <summary>
        /// Genera el Reporte de Efectivo Pendiente de Verificación, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>   
        public async Task<IEnumerable<PendingCashVerificationReportDto>> HandleAsync(GetPendingCashVerificationReportQuery query)
        {
            var orders = await _repository.GetPendingCashVerificationAsync(
                query.StartDate,
                query.EndDate,
                query.OperatorId,
                query.DeliveryTeamId
            );

            _logger.LogInformation("Se recuperaron {Count} pedidos pendientes de verificación de efectivo.", orders.Count);

            // Obtener operadores desde el Identity Service
            var deliveryOperators = await _identityServiceClient.GetUserWithRoleDeliveryOperator()
                ?? new List<DeliveryOperatorDto>();

            // Crear diccionario para acceso rápido
            var operatorsById = deliveryOperators.ToDictionary(op => op.Id.ToLowerInvariant(), op => op);

            // Mapear las órdenes agregando el nombre del operador
            var reportList = orders.Select(o =>
            {
                string fullName = string.Empty;

                if (o.AssignedOperatorId.HasValue)
                {
                    var opId = o.AssignedOperatorId.Value.ToString().ToLowerInvariant();
                    if (operatorsById.TryGetValue(opId, out var op))
                        fullName = op.FullName;
                }

                return new PendingCashVerificationReportDto
                {
                    OrderId = o.Id,
                    CustomerName = $"{o.Customer.FirstName} {o.Customer.LastName}".Trim(),
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.OrderDate,
                    AssignedOperatorId = o.AssignedOperatorId,
                    FullNameDeliveringOperator = fullName,
                    AssignedTeamName = o.AssignedDeliveryTeam?.TeamName
                };
            }).ToList();

            return reportList;
        }
    }
}
