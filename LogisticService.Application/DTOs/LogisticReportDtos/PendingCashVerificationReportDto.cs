using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class PendingCashVerificationReportDto
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public Guid? AssignedOperatorId { get; set; }
        public string? AssignedTeamName { get; set; }
    }
}
