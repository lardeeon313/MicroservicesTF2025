using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay
{
    public interface IMarkOrderOnTheWayCommandHandler
    {
        Task<bool> MarkOrderOnTheWayAsync(MarkOrderOnTheWayCommand command);
    }
}
