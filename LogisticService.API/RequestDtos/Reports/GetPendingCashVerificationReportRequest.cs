namespace LogisticService.API.RequestDtos.Reports
{
    public class GetPendingCashVerificationReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? OperatorId { get; set; }
        public int? DeliveryTeamId { get; set; }

        // Paginación
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
