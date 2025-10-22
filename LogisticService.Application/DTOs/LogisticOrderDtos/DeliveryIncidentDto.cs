using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public class    DeliveryIncidentDto
    {
        public int Id { get; set; }
        public int LogisticOrderId { get; set; }
        public Guid ReportedByOperatorId { get; set; }
        public string IncidentType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
        public bool Resolved { get; set; } = false;
        public DateTime? ResolvedAt { get; set; }
        public string? ResolutionNote { get; set; }
        public DeliveryIncidentStatus DeliveryIncidentStatus { get; set; }
    }
}
