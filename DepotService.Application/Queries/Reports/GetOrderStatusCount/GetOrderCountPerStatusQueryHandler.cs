using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;

namespace DepotService.Application.Queries.Reports.GetOrderStatusCount
{
    public class GetOrderCountPerStatusQueryHandler(IDepotReportRepository repository) : IGetOrderCountPerStatusQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        public async Task<List<OrderStatusCountDto>> HandleAsync(GetOrderCountPerStatusQuery query)
        {
            var OrderCountPerStatus = await _repository.GetOrderCountPerStatusAsync(query.From, query.To);
            if (OrderCountPerStatus == null || !OrderCountPerStatus.Any())
            {
                throw new InvalidOperationException("No order counts found for the specified date range.");
            }

            return OrderCountPerStatus.Select(count => new OrderStatusCountDto
            {
                Status = count.Status,
                Count = count.Count
            }).ToList();
        }
    }
}
