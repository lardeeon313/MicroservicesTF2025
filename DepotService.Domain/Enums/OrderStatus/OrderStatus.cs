using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Enums.OrderStatus
{
    public enum OrderStatus
    {
        Pending,
        Issued, //Emitido
        Confirmed,
        InPreparation,
        Prepared,
        Invoiced,
        Verify,
        OnTheWay,
        Delivered,
        Canceled
    }
}
