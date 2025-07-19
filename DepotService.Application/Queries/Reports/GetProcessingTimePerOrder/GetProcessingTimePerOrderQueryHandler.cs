using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime;
using DepotService.Domain.IRepositories;
using Microsoft.Extensions.Logging;

namespace DepotService.Application.Queries.Reports.GetProcessingTimePerOrder
{
    public class GetProcessingTimePerOrderQueryHandler(IDepotReportRepository repository, ILogger<GetProcessingTimePerOrderQueryHandler> logger) : IGetProcessingTimePerOrderQueryHandler
    {
        private readonly ILogger<GetProcessingTimePerOrderQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly IDepotReportRepository _repository = repository;

        public async Task<PaginatedResult<OrderProcessingTimeDto>> HandleAsync(GetProcessingTimePerOrderQuery query)
        {
            var orderProcessingTimes = await _repository.GetAverageProcessingTimePerOrderAsync(query.From, query.To, query.Page, query.PageSize);
            if (orderProcessingTimes == null || !orderProcessingTimes.Items.Any())
            {
                _logger.LogWarning("No order processing times found for the specified date range.");
                return new PaginatedResult<OrderProcessingTimeDto>
                {
                    Items = new List<OrderProcessingTimeDto>(),
                    TotalItems = 0,
                    TotalPages = 0,
                    CurrentPage = query.Page
                };
            }
            return new PaginatedResult<OrderProcessingTimeDto>
            {
                Items = orderProcessingTimes.Items.Select(x => new OrderProcessingTimeDto
                {
                    OrderId = x.OrderId,
                    DurationMinutes = x.DurationMinutes
                }).ToList(),
                TotalItems = orderProcessingTimes.TotalItems,
                TotalPages = orderProcessingTimes.TotalPages,
                CurrentPage = orderProcessingTimes.CurrentPage
            };
        }
    }
}
