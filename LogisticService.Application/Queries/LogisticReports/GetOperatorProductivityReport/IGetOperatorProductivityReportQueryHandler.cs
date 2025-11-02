using LogisticService.Application.DTOs.LogisticReportDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOperatorProductivityReport
{
    public interface IGetOperatorProductivityReportQueryHandler
    {
        Task<List<OperatorProductivityReportDto>> IGetOperatorProductivityReportAsync(GetOperatorProductivityReportQuery query);
    }
}
