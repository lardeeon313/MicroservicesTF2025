using LogisticService.Application.DTOs.LogisticReportDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport
{
    public interface IGetOrderStatusHistoryReportQueryHandler
    {
        Task<IEnumerable<OrderStatusHistoryReportDto>> HandleAsync(GetOrderStatusHistoryReportQuery query);
    }
}
