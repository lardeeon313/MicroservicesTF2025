using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetAllMissingOrders
{
    public interface IGetAllMissingOrdersQueryHandler
    {
        Task<IEnumerable<OrderMissingDto>> GetAllMissingOrdersAsync();
    }
}
