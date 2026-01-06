using SalesService.Domain.Helper;

namespace SalesService.API.RequestDtos.Reports
{
    public class GetCustomerSatisfactionReportRequest
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public SatisfactionLevel? Level { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
