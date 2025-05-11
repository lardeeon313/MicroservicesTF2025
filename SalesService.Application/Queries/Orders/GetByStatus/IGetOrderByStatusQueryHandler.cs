using SalesService.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetByStatus
{
    public interface IGetOrderByStatusQueryHandler
    {
        Task<IEnumerable<OrderDto>> HandleAsync(string status);
    }
}
