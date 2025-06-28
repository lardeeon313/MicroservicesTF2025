using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange
{
    /// <summary>
    ///  query para obtener las órdenes facturadas dentro de un rango de fechas específico.
    /// </summary>
    public class GetInvoicedOrdersByDateRangeQuery
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public GetInvoicedOrdersByDateRangeQuery(DateTime start, DateTime end)
        {
            StartDate = start;
            EndDate = end;
        }
    }
}
