using LogisticService.Application.DTOs.LogisticReportDtos;
using SharedKernel.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetCustomersWithMostIncidentsReport
{
    public interface IGetCustomersWithMostIncidentsReportQueryHandler
    {
        Task<PagedResult<CustomerIncidentReportDto>> HandleAsync(GetCustomersWithMostIncidentsReportQuery query);
    }
}
