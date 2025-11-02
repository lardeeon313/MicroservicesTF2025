namespace LogisticService.API.RequestDtos.Reports
{
    public class GetZonePerformanceReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? OperatorId { get; set; }
        public int? DeliveryTeamId { get; set; }
    }
}
