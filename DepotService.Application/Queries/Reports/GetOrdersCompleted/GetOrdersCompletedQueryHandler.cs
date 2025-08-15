using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersCompleted
{
    public class GetOrdersCompletedQueryHandler(IDepotReportRepository repository) : IGetOrdersCompletedQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        public async Task<PaginatedResult<CompletedOrdersReportDto>> HandleAsync(GetOrdersCompletedQuery query)
        {
            var result = await _repository.GetCompletedOrdersAsync(query.From, query.To, query.Page, query.PageSize);

            return new PaginatedResult<CompletedOrdersReportDto>
            {
                Items = result.Items.Select(o => new CompletedOrdersReportDto
                {
                    DepotOrderId = o.DepotOrderId,
                    SalesOrderId = o.SalesOrderId,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    OrderDate = o.OrderDate,
                    CompletedAt = o.CompletedAt,
                    DeliveryDate = o.DeliveryDate,
                }).ToList(),
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                CurrentPage = result.CurrentPage
            };
        }
    }
}
