using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident
{
    public class ReportDeliveryIncidentCommand
    {
        public int LogisticOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public string IncidentType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ReportDeliveryIncidentCommand(int logisticOrderId, Guid operatorUserId, string incidentType, string description)
        {
            LogisticOrderId = logisticOrderId;
            OperatorUserId = operatorUserId;
            IncidentType = incidentType;
            Description = description;
        }
    }
}
