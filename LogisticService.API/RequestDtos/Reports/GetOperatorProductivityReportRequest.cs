using LogisticService.Domain.Enums;

namespace LogisticService.API.RequestDtos.Reports
{
    public class GetOperatorProductivityReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public PaymentType? PaymentType { get; set; }
    }
}
