using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class DeliveryRejectionReportDto
    {
        public int Id { get; set; }
        public int LogisticOrderId { get; set; }
        public Guid OperatorId { get; set; }
        public string FullNameDeliveringOperator { get; set; } = string.Empty;
        public string RejectionType { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public DateTime RejectedAt { get; set; }
        public int? DeliveryZoneId { get; set; }
        public string? DeliveryZoneName { get; set; }
        public int? DeliveryTeamId { get; set; }
        public string? DeliveryTeamName { get; set; }
        public string? CustomerName { get; set; }
    }
}
