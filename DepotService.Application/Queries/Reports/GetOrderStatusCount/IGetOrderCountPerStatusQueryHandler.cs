using DepotService.Application.DTOs.Reports;
using DepotService.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrderStatusCount
{
    public interface IGetOrderCountPerStatusQueryHandler
    {
        Task<List<OrderStatusCountDto>> HandleAsync(GetOrderCountPerStatusQuery query);
    }
}
