using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using SalesService.Domain.Helper;
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
        public async Task<PagedResult<CustomerIncidentReportDto>> HandleAsync(GetCustomersWithMostIncidentsReportQuery query)
        {
            var results = await _repository.GetCustomersWithMostIncidentsAsync(
                query.StartDate,
                query.EndDate,
                query.CustomerId,
                query.IncidentType,
                query.PageNumber,
                query.PageSize
            );

            _logger.LogInformation("Reporte de clientes con mayor incidencia generado. Página {PageNumber}/{TotalPages}",
                query.PageNumber, results.TotalPages);

            return new PagedResult<CustomerIncidentReportDto>
            {
                Items = results.Items.Select(r => new CustomerIncidentReportDto
                {
                    CustomerId = r.CustomerId,
                    CustomerName = r.CustomerName,
                    TotalOrders = r.TotalOrders,
                    TotalIncidents = r.TotalIncidents,
                    TotalRejections = r.TotalRejections,
                    IncidentRatePercent = r.IncidentRatePercent,
                    RejectionRatePercent = r.RejectionRatePercent
                }),
                TotalCount = results.TotalCount,
                PageNumber = results.PageNumber,
                PageSize = results.PageSize
            };
        }
    }
}
