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
        private Guid? operatorId1;
        private OrderStatus? oldStatus;
        private OrderStatus? newStatus;
        private Guid? operatorId2;

        public GetOrderStatusHistoryReportQuery(DateTime? startDate, DateTime? endDate, Guid? operatorId1, OrderStatus? oldStatus, OrderStatus? newStatus, Guid? operatorId2, int pageNumber, int pageSize)
        {
            StartDate = startDate;
            EndDate = endDate;
            this.operatorId1 = operatorId1;
            this.oldStatus = oldStatus;
            this.newStatus = newStatus;
            this.operatorId2 = operatorId2;
            PageNumber = pageNumber;
            PageSize = pageSize;

        }   

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public OrderStatus? OldStatus { get; set; }
        public OrderStatus? NewStatus { get; set; }
        public Guid? OperatorId { get; set; }

        // pagination       
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
