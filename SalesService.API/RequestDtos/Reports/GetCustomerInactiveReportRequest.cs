using SalesService.Domain.Enums;

namespace SalesService.API.RequestDtos.Reports
{
    public class GetCustomerInactiveReportRequest
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public CustomerStatus? Status { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
