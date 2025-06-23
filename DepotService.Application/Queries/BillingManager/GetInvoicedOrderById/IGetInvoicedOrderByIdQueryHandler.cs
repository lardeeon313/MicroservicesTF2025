using DepotService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetInvoicedOrderById
{
    public interface IGetInvoicedOrderByIdQueryHandler
    {
        Task<DepotOrderDto> GetInvoicedOrderByIdAsync(GetInvoicedOrderByIdQuery query);
    }
}
