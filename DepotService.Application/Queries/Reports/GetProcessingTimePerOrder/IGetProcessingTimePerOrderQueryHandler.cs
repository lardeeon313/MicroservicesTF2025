using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime
{
    public interface IGetProcessingTimePerOrderQueryHandler
    {
        Task<PaginatedResult<OrderProcessingTimeDto>> HandleAsync(GetProcessingTimePerOrderQuery query);
    }
}
