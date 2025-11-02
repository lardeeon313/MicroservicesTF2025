using LogisticService.Application.DTOs.LogisticReportDtos;
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
    public class GetDeliveryTimeReportQueryHandler(ILogisticReportRepository repository, ILogger<GetDeliveryTimeReportQueryHandler> logger) : IGetDeliveryTimeReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetDeliveryTimeReportQueryHandler> _logger = logger;

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

            var deliveredOrders = orders.Where(o => o.Status == OrderStatus.Delivered).ToList();

            var grouped = deliveredOrders
                .GroupBy(o => new { o.AssignedOperatorId, o.AssignedDeliveryZoneId, o.AssignedDeliveryZone?.Name })
                .Select(g => new DeliveryTimeReportDto
                {
                    OperatorId = g.Key.AssignedOperatorId,                    
                    DeliveryZoneId = g.Key.AssignedDeliveryZoneId,
                    DeliveryZoneName = g.Key.Name,
                    TotalDeliveredOrders = g.Count(),
                    AverageDeliveryTimeInHours = g.Average(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours),
                    MaxDeliveryTimeInHours = g.Max(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours),
                    MinDeliveryTimeInHours = g.Min(o => (o.DeliveryDate!.Value - o.OrderDate).TotalHours)
                })
                .OrderBy(r => r.DeliveryZoneName)                
                .ToList();

            _logger.LogInformation("Generated DeliveryTime report with {Count} entries", grouped.Count);

            return grouped;
        }
    }
}
