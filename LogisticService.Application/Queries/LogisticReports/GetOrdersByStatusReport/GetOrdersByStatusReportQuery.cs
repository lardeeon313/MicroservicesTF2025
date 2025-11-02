using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport
{
    public class GetOrdersByStatusReportQuery
    {
        private PaymentType? paymentType;

        public GetOrdersByStatusReportQuery(DateTime? startDate, DateTime? endDate, int? deliveryZoneId, int? deliveryTeamId, PaymentType? paymentType, Guid? operatorId)
        {
            StartDate = startDate;
            EndDate = endDate;
            DeliveryZoneId = deliveryZoneId;
            DeliveryTeamId = deliveryTeamId;
            this.paymentType = paymentType;
            OperatorId = operatorId;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }
        public PaymentType? PaymentType { get; set; }
    }
}
