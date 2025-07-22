using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersInPreparation
{
    public class GetOrdersInPreparationQueryHandler(IDepotReportRepository repository) : IGetOrdersInPreparationQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository;

        public async Task<PaginatedResult<OrdersInPreparationDto>> HandleAsync(GetOrdersInPreparationQuery query)
        {
            var result = await _repository.GetOrdersInPreparationAsync(query.Page, query.PageSize, query.From, query.To);
            return new PaginatedResult<OrdersInPreparationDto>
            {
                Items = result.Items.Select(o => new OrdersInPreparationDto
                {
                    OrderId = o.OrderId,
                    CreatedAt = o.CreatedAt,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    PhoneNumber = o.PhoneNumber,
                    DeliveryDetail = o.DeliveryDetail,
                    InPreparationAt = o.InPreparationAt,
                    DeliveryDate = o.DeliveryDate,
                    DepotTeamName = o.DepotTeamName
                }).ToList(),
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                CurrentPage = result.CurrentPage
            };


        }
    }
}
