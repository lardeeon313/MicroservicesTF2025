using LogisticService.Domain.Enums;

namespace LogisticService.API.RequestDtos.Reports
{
    public class GetOrderStatusHistoryReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public OrderStatus? OldStatus { get; set; }
        public OrderStatus? NewStatus { get; set; }
        public Guid? OperatorId { get; set; }

        // paginación
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
