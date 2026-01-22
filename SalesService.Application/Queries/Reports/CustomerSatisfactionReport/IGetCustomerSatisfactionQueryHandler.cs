using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerSatisfactionReport
{
    public interface IGetCustomerSatisfactionQueryHandler
    {
        Task<PagedResult<CustomerSatisfactionReportDto>> HandleAsync(GetCustomerSatisfactionQuery query);
    }
}
