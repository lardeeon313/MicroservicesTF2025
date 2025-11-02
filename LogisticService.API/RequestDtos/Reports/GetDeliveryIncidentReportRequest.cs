namespace LogisticService.API.RequestDtos.Reports
{
    public class GetDeliveryIncidentReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }
        public bool? Resolved { get; set; }
    }
}
