using DepotService.Application.DTOs.DepotOrder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder
{
    public interface IGetBillingDetailsByOrderIdQueryHandler
    {
        Task<DepotOrderDto> GetBillingDetailsByOrderIdAsync(GetBillingDetailsByOrderIdQuery query);
    }
}
