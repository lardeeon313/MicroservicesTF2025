using LogisticService.Application.DTOs.LogisticReportDtos;
using SalesService.Domain.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport
{
    public interface IGetDeliveryRejectionsReportQueryHandler
    {
        Task<PagedResult<DeliveryRejectionReportDto>> HandleAsync(GetDeliveryRejectionsReportQuery query);
    }
}
