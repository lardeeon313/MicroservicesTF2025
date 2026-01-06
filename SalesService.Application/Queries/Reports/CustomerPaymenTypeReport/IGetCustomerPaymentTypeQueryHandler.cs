using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerPaymenTypeReport
{
    public interface IGetCustomerPaymentTypeQueryHandler
    {
        Task<PagedResult<CustomerPaymentTypeReportDto>> GetCustomerPaymentTypeReportAsync(GetCustomerPaymentTypeQuery query);
    }
}
