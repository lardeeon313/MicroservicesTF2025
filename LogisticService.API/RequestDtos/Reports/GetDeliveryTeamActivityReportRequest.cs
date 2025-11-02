namespace LogisticService.API.RequestDtos.Reports
{
    public class GetDeliveryTeamActivityReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryTeamId { get; set; }
        public int? DeliveryZoneId { get; set; }
    }
}
