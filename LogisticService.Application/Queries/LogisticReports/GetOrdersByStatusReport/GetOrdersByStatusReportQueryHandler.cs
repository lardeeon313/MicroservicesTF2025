using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport
{
    public class GetOrdersByStatusReportQueryHandler(ILogisticReportRepository repository, ILogger<GetOrdersByStatusReportQueryHandler> logger) : IGetOrdersByStatusReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetOrdersByStatusReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de órdenes agrupadas por estado, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<List<OrdersByStatusReportDto>> ordersByStatusReportDtos(GetOrdersByStatusReportQuery query)
        {
            var orders = await _repository.GetFilteredOrdersAsync(
                query.StartDate,
                query.EndDate,
                query.DeliveryZoneId,
                query.DeliveryTeamId,
                query.OperatorId,
                query.PaymentType
            );

            var grouped = orders
                .GroupBy(o => o.Status)
                .Select(g => new OrdersByStatusReportDto
                {
                    Status = g.Key.ToString(),
                    Count = g.Count()
                })
                .OrderBy(r => r.Status)
                .ToList();

            _logger.LogInformation(
                "Generated OrdersByStatus report with {Count} grouped statuses between {StartDate} and {EndDate}",
                grouped.Count,
                query.StartDate?.ToShortDateString() ?? "N/A",
                query.EndDate?.ToShortDateString() ?? "N/A"
            );

            return grouped;
        }
    }
}
