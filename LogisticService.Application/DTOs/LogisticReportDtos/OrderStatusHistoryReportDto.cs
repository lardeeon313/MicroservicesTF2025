using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class OrderStatusHistoryReportDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string OldStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
        public double AverageDurationSeconds { get; set; }
        public Guid? AssignedOperatorId { get; set; }
        public string FullNameDeliveringOperator { get; set; } = string.Empty;
        public string? AssignedTeamName { get; set; }
    }
}
