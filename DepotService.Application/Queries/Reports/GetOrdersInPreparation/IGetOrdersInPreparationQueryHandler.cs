using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersInPreparation
{
    public interface IGetOrdersInPreparationQueryHandler
    {
        Task<PaginatedResult<OrdersInPreparationDto>> HandleAsync(GetOrdersInPreparationQuery query);
    }
}
