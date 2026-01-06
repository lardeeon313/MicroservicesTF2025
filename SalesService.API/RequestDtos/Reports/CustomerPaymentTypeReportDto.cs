using SalesService.Domain.Enums;

namespace SalesService.API.RequestDtos.Reports
{
    public class CustomerPaymentTypeReportRequest
    {
        public string? Name { get; init; }
        public List<PaymentType>? PaymentTypes { get; init; }

        public DateTime? From { get; init; }
        public DateTime? To { get; init; }

        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}
