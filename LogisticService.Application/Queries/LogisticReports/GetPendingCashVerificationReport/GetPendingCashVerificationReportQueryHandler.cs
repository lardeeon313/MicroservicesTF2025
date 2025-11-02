using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport
{
    public class GetPendingCashVerificationReportQueryHandler(ILogisticReportRepository repository, ILogger<GetPendingCashVerificationReportQueryHandler> logger) : IGetPendingCashVerificationReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetPendingCashVerificationReportQueryHandler> _logger = logger;

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

            return orders.Select(o => new PendingCashVerificationReportDto
            {
                OrderId = o.Id,
                CustomerName = $"{o.Customer.FirstName} {o.Customer.LastName}".Trim(),
                TotalAmount = o.TotalAmount,
                OrderDate = o.OrderDate,
                AssignedOperatorId = o.AssignedOperatorId,
                AssignedTeamName = o.AssignedDeliveryTeam?.TeamName
            }).ToList();
        }
    }
}
