using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport
{
    public class GetOrderStatusHistoryReportQueryHandler(ILogisticReportRepository repository, ILogger<GetOrderStatusHistoryReportQueryHandler> logger) : IGetOrderStatusHistoryReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetOrderStatusHistoryReportQueryHandler> _logger = logger;

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

            return results.Select(r => new OrderStatusHistoryReportDto
            {
                Id = r.Id,
                OrderId = r.OrderId,
                CustomerName = r.CustomerName,
                OldStatus = r.OldStatus,
                NewStatus = r.NewStatus,
                ChangedAt = r.ChangedAt,
                AverageDurationSeconds = r.AverageDurationSeconds,
                AssignedOperatorId = r.AssignedOperatorId,
                AssignedTeamName = r.AssignedTeamName
            }).ToList();
        }
    }
}
