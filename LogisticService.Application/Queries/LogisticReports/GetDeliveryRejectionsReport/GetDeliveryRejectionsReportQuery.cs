using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport
{
    public class GetDeliveryRejectionsReportQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }

        public int PageNumber { get; } = 1;
        public int PageSize { get; } = 20;

        public GetDeliveryRejectionsReportQuery(DateTime? startDate, DateTime? endDate, Guid? operatorId, int? deliveryZoneId, int pageNumber, int pageSize)
        {
            StartDate = startDate;
            EndDate = endDate;
            OperatorId = operatorId;
            DeliveryZoneId = deliveryZoneId; 
            PageNumber = pageNumber;
            PageSize = pageSize;
        }       
    }   
}
