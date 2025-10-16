using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder
{
    public interface ICheckCashOrderCommandHandler
    {
        Task<bool> CheckCashHandleAsync(CheckCashOrderCommand command);
    }
}
