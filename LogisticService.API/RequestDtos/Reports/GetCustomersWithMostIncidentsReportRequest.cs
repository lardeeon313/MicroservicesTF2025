namespace LogisticService.API.RequestDtos.Reports
{
    public class GetCustomersWithMostIncidentsReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? CustomerId { get; set; }
        public string? IncidentType { get; set; }

        // Pagination properties
        public int PageNumber { get; set; } = 1; 
        public int PageSize { get; set; } = 20;  
    }
}
