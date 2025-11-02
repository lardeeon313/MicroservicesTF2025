using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTeamActivityReport
{
    public class GetDeliveryTeamActivityReportQuery
    {
        public GetDeliveryTeamActivityReportQuery(DateTime? startDate, DateTime? endDate, int? deliveryTeamId)
        {
            StartDate = startDate;
            EndDate = endDate;
            DeliveryTeamId = deliveryTeamId;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryTeamId { get; set; }
        public int? DeliveryZoneId { get; set; }
    }
}
