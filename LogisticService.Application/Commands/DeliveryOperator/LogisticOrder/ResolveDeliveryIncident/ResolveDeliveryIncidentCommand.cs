using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident
{
    public class ResolveDeliveryIncidentCommand
    {
        public int IncidentId { get; set; }
        public int LogisticOrderId { get; set; }
        public DeliveryIncidentStatus ResolutionStatus { get; set; }
        public string ResolutionNotes { get; set; } = string.Empty;
        public DateTime ResolvedAt { get; set; } = DateTime.UtcNow;

        public ResolveDeliveryIncidentCommand(int incidentId, int logisticOrderId, DeliveryIncidentStatus resolutionStatus, string resolutionNotes)
        {
            IncidentId = incidentId;
            LogisticOrderId = logisticOrderId;
            ResolutionStatus = resolutionStatus;
            ResolutionNotes = resolutionNotes;
        }
    }
}
