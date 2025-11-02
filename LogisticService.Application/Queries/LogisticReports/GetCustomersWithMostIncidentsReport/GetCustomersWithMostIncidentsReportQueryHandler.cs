using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetCustomersWithMostIncidentsReport
{
    public class GetCustomersWithMostIncidentsReportQueryHandler(ILogisticReportRepository repository, ILogger<GetCustomersWithMostIncidentsReportQueryHandler> logger) : IGetCustomersWithMostIncidentsReportQueryHandler
    {
        private readonly ILogisticReportRepository _repository = repository;
        private readonly ILogger<GetCustomersWithMostIncidentsReportQueryHandler> _logger = logger;

        /// <summary>
        /// Genera el reporte de clientes con mayor incidencia, con filtros opcionales.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>   
        public async Task<IEnumerable<CustomerIncidentReportDto>> HandleAsync(GetCustomersWithMostIncidentsReportQuery query)
        {
            var results = await _repository.GetCustomersWithMostIncidentsAsync(
                query.StartDate,
                query.EndDate,
                query.CustomerId,
                query.IncidentType
            );

            _logger.LogInformation("Reporte de clientes con mayor incidencia generado con {Count} registros.", results.Count);

            return results.Select(r => new CustomerIncidentReportDto
            {
                CustomerId = r.CustomerId,
                CustomerName = r.CustomerName,
                TotalOrders = r.TotalOrders,
                TotalIncidents = r.TotalIncidents,
                TotalRejections = r.TotalRejections,
                IncidentRatePercent = r.IncidentRatePercent,
                RejectionRatePercent = r.RejectionRatePercent
            }).ToList();
        }
    }
}
