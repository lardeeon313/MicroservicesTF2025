using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport
{
    public class GetDeliveryIncidentReportQuery
    {
        public GetDeliveryIncidentReportQuery(DateTime? startDate, DateTime? endDate, Guid? operatorId, int? deliveryZoneId, int? deliveryTeamId, int pageNumber, int pageSize)
        {
            StartDate = startDate;
            EndDate = endDate;
            OperatorId = operatorId;
            DeliveryZoneId = deliveryZoneId;
            DeliveryTeamId = deliveryTeamId;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }
        public bool? Resolved { get; set; }
        public int PageNumber { get; } = 1;
        public int PageSize { get; } = 20;

    }
}
