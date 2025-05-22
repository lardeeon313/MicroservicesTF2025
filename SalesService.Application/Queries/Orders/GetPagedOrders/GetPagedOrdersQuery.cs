using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetPagedOrders
{
    /// <summary>
    /// Consulta para obtener las órdenes paginadas.
    /// </summary>
    public class GetPagedOrdersQuery
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public GetPagedOrdersQuery(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
