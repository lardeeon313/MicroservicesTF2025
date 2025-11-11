    namespace LogisticService.API.RequestDtos.Reports
{
    public class GetDeliveryRejectionsReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DeliveryZoneId { get; set; }
        public int? DeliveryTeamId { get; set; }
        public Guid? OperatorId { get; set; }

        // Paginación
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20; 
    }
}
