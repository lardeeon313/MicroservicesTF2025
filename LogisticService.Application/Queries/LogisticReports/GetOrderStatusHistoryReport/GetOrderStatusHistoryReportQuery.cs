using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport
{
    public class GetOrderStatusHistoryReportQuery
    {
        public GetOrderStatusHistoryReportQuery(
            DateTime? startDate,
            DateTime? endDate,
            Guid? operatorId,
            OrderStatus? oldStatus,
            OrderStatus? newStatus,
            Guid? operatorId2,
            int pageNumber,
            int pageSize)
        {
            StartDate = startDate;
            EndDate = endDate;

            
            OperatorId = operatorId;

            
            OldStatus = oldStatus;
            NewStatus = newStatus;

            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public OrderStatus? OldStatus { get; set; }
        public OrderStatus? NewStatus { get; set; }

        public Guid? OperatorId { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }

}