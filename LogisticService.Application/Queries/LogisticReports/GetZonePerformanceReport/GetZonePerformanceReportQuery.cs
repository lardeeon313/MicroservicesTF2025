using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetZonePerformanceReport
{
    public class GetZonePerformanceReportQuery
    {
        private Guid? operatorId;

        public GetZonePerformanceReportQuery(DateTime? startDate, DateTime? endDate, int? deliveryTeamId, Guid? operatorId)
        {
            StartDate = startDate;
            EndDate = endDate;
            DeliveryTeamId = deliveryTeamId;
            this.operatorId = operatorId;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
    }
}
