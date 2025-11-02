using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class CustomerIncidentReportDto
    {
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        public int TotalOrders { get; set; }
        public int TotalIncidents { get; set; }
        public int TotalRejections { get; set; }

        public double IncidentRatePercent { get; set; }
        public double RejectionRatePercent { get; set; }
    }
}
