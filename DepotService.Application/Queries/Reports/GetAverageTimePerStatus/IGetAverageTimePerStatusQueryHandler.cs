using DepotService.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetAverageTimePerStatus
{
    public interface IGetAverageTimePerStatusQueryHandler
    {
        Task<List<StatusAverageTimeDto>> GetAverageTimePerStatusAsync(GetAverageTimePerStatusQuery query);
    }
}
