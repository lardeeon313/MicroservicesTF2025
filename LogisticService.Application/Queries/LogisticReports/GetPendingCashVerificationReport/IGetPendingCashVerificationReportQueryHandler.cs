using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingCashOrders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport
{
    public interface IGetPendingCashVerificationReportQueryHandler
    {
        Task<IEnumerable<PendingCashVerificationReportDto>> HandleAsync(GetPendingCashVerificationReportQuery query);
    }
}
