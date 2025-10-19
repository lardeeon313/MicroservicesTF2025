using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident
{
    public interface IReportDeliveryIncidentCommandHandler
    {
        Task<bool> ReportIncidentAsync(ReportDeliveryIncidentCommand command);
    }
}
