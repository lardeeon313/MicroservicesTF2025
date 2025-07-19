using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersByDeliveryDate
{
    public class GetOrdersByDeliveryDateQueryHandler(IDepotReportRepository repository) : IGetOrdersByDeliveryDateQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        public async Task<PaginatedResult<OrderByDeliveryDateDto>> HandleAsync(GetOrdersByDeliveryDateQuery query)
        {
            var orders = await _repository.GetOrdersByDeliveryDateAsync(query.From, query.To, query.Page, query.PageSize);

            return new PaginatedResult<OrderByDeliveryDateDto>
            {
                Items = orders.Items.Select(o => new OrderByDeliveryDateDto
                {
                    OrderId = o.OrderId,
                    DeliveryDetail = o.DeliveryDetail,
                    DeliveryDate = o.DeliveryDate
                }).ToList(),
                TotalItems = orders.TotalItems,
                TotalPages = orders.TotalPages,
                CurrentPage = orders.CurrentPage
            };
        }
    }
}
