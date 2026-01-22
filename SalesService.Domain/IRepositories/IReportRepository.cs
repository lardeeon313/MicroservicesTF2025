using SalesService.Domain.Enums;
using SalesService.Domain.Helper;
using SalesService.Domain.ValueObjects;
namespace SalesService.Domain.IRepositories
{
    public interface IReportRepository
    {
        Task<PagedResult<CustomerReport>> GetCustomerReportAsync(
            string? name,
            string? email,
            int? minOrders,
            int page,
            int pageSize);

        Task<PagedResult<CustomerSatisfactionReport>> GetCustomerSatisfactionReportAsync(
            string? name,
            string? email,
            SatisfactionLevel? level,
            int page,
            int pageSize);

        Task<PagedResult<CustomerStatusReport>> GetCustomerStatusReportAsync(
            string? name,
            string? email,
            CustomerStatus? status,
            int page,
            int pageSize);

        Task<PagedResult<ModifiedCanceledOrderReport>> GetModifiedOrCanceledAsync(
            string? customerName,
            DateTime? dateFrom,
            DateTime? dateTo,
            OrderStatus? status,
            int page,
            int pageSize
        );

        Task<PagedResult<CustomerPaymentTypeReport>>GetCustomerPaymentTypeReportAsync(
            string? name,
            List<PaymentType>? paymentTypes,
            DateTime? from,
            DateTime? to,
            int page,
            int pageSize
        );

    }
}
