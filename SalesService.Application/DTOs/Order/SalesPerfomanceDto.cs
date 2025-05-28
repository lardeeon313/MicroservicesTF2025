using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order
{
    public class SalesPerfomanceDto
    {
        public string SalespersonName { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public int TotalUnitsSold { get; set; }
        public DateTime LastOrderDate { get; set; }
    }
}
