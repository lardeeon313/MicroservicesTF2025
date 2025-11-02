using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOperatorProductivityReport
{
    public class GetOperatorProductivityReportQuery
    {        
        public GetOperatorProductivityReportQuery(DateTime? startDate, DateTime? endDate, int? deliveryTeamId, int? deliveryZoneId, PaymentType? paymentType)
        {
            StartDate = startDate;
            EndDate = endDate;
            DeliveryTeamId = deliveryTeamId;
            PaymentType = paymentType;
            DeliveryZoneId = deliveryZoneId;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public PaymentType? PaymentType { get; set; }
    }
}
