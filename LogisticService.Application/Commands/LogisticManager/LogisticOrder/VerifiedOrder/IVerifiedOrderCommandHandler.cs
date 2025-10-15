using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder
{
    public interface IVerifiedOrderCommandHandler
    {
        Task<bool> VerifiedOrderHandleAsync(VerifiedOrderCommand command);
    }
}
