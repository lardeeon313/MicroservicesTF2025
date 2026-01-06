using SalesService.Domain.Enums;

namespace SalesService.API.RequestDtos.Reports
{
    public class GetModifiedCanceledOrderRequest
    {
        public string? CustomerName { get; init; }
        public DateTime? DateFrom { get; init; }
        public DateTime? DateTo { get; init; }
        public OrderStatus? Status { get; init; }

        public int Page { get; init; }
        public int PageSize { get; init; }
    }
}
