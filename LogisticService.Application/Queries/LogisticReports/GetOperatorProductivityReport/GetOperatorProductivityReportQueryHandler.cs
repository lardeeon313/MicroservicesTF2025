using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOperatorProductivityReport
{
    public class GetOperatorProductivityReportQueryHandler(ILogisticReportRepository repository, ILogger<GetOperatorProductivityReportQueryHandler> logger) : IGetOperatorProductivityReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetOperatorProductivityReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de productividad del operador, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<List<OperatorProductivityReportDto>> IGetOperatorProductivityReportAsync(GetOperatorProductivityReportQuery query)
        {
            var orders = await _repository.GetFilteredOrdersAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                null, // no filtramos operador porque agrupamos por operador
                query.PaymentType
            );

            var grouped = orders
                .GroupBy(o => new { o.AssignedOperatorId })
                .Select(g => new OperatorProductivityReportDto
                {
                    OperatorId = g.Key.AssignedOperatorId ?? Guid.Empty,                    
                    TotalOrders = g.Count(),
                    DeliveredOrders = g.Count(o => o.Status == OrderStatus.Delivered),
                    RejectedOrders = g.Count(o => o.Status == OrderStatus.AssignmentCancelled),
                    PendingOrders = g.Count(o => o.Status == OrderStatus.PendingDelivery),
                    CanceledOrders = g.Count(o => o.Status == OrderStatus.Canceled),
                    TotalCollectedAmount = g.Sum(o => o.TotalAmount)
                })
                .OrderByDescending(r => r.TotalOrders)
                .ToList();

            _logger.LogInformation("Generated OperatorProductivity report with {Count} operators", grouped.Count);

            return grouped;
        }
    }
}
