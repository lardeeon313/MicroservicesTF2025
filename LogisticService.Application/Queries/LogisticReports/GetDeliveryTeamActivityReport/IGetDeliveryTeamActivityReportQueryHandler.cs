using LogisticService.Application.DTOs.LogisticReportDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTeamActivityReport
{
    public interface IGetDeliveryTeamActivityReportQueryHandler
    {
        Task<IEnumerable<TeamActivityReportDto>> HandleAsync(GetDeliveryTeamActivityReportQuery query);
    }
}
