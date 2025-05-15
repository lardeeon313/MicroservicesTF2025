using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Response
{

    /// <summary>
    /// Representa una respuesta paginada de órdenes.
    /// </summary>
    public class PagedOrderResponse
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public List<OrderDto> Orders { get; set; } = new();
    }
}
