namespace SalesService.API.RequestDtos.Reports
{
    public class GetCustomerReportRequest
    {
        public string? Name { get; init; }
        public string? Email { get; init; }
        public int? MinOrders { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
