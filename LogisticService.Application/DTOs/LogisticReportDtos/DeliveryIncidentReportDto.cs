using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class DeliveryIncidentReportDto
    {
        public int Id { get; set; }
        public int LogisticOrderId { get; set; }
        public Guid ReportedByOperatorId { get; set; }
        public Guid? AssignedOperatorId { get; set; }
        public string IncidentType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReportedAt { get; set; }
        public bool Resolved { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? ResolutionNote { get; set; }
        public string? DeliveryIncidentStatus { get; set; }
        public int? DeliveryZoneId { get; set; }
        public string? DeliveryZoneName { get; set; }
        public int? DeliveryTeamId { get; set; }
        public string? DeliveryTeamName { get; set; }
        public string? CustomerName { get; set; }
    }
}
