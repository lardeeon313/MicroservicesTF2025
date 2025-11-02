using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class TeamActivityReportDto
    {
        public int DeliveryTeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;

        public int TotalOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int IncidentsCount { get; set; }
        public int RejectionsCount { get; set; }

        public double AverageDeliveryTimeHours { get; set; }
        public double IncidentRatePercent { get; set; }
        public double RejectionRatePercent { get; set; }
        public double DeliverySuccessRatePercent { get; set; }
    }
}
