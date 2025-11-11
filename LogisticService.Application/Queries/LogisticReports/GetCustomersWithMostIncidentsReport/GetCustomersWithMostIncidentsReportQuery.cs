using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticReports.GetCustomersWithMostIncidentsReport
{
    public class GetCustomersWithMostIncidentsReportQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? CustomerId { get; set; }
        public string? IncidentType { get; set; }

        public int PageNumber { get; } = 1;
        public int PageSize { get; } = 20;

        public GetCustomersWithMostIncidentsReportQuery(DateTime? startDate, DateTime? endDate, Guid? customerId, string? incidentType, int pageNumber, int pageSize)
        {
            StartDate = startDate;
            EndDate = endDate;
            CustomerId = customerId;
            IncidentType = incidentType;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
