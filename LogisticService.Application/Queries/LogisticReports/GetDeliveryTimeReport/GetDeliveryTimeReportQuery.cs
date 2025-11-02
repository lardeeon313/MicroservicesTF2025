using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport
{
    public class GetDeliveryTimeReportQuery
    {
        public GetDeliveryTimeReportQuery(DateTime? startDate, DateTime? endDate, int? deliveryZoneId, int? deliveryTeamId)
        {
            StartDate = startDate;
            EndDate = endDate;
            DeliveryZoneId = deliveryZoneId;
            DeliveryTeamId = deliveryTeamId;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }
    }
}
