using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder
{
    public interface IConfirmAssignedOrderCommandHandler 
    {
        Task HandleAsync(ConfirmAssignedOrderCommand command);
    }
}
