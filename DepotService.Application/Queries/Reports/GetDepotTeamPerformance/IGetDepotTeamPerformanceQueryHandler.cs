using DepotService.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetDepotTeamPerformance
{
    /// <summary>
    /// Interface for handling the GetDepotTeamPerformanceQuery.
    /// </summary>
    public interface IGetDepotTeamPerformanceQueryHandler
    {
        Task<List<DepotTeamPerformanceDto>> HandleAsync(GetDepotTeamPerformanceQuery request);
    }
}
