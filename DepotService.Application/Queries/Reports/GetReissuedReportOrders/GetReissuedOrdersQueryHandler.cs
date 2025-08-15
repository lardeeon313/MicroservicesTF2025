using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetReissuedReportOrders
{
    public class GetReissuedOrdersQueryHandler(IDepotReportRepository repository) : IGetReissuedOrdersQueryHandler
    {
        private readonly IDepotReportRepository _repository = repository;
        public async Task<PaginatedResult<ReissuedOrderReportDto>> HandleAsync(GetReissuedOrdersQuery query)
        {
            var result = await _repository.GetReissuedOrdersAsync(query.From, query.To, query.Page, query.PageSize);

            return new PaginatedResult<ReissuedOrderReportDto>
            {
                Items = result.Items.Select(o => new ReissuedOrderReportDto
                {
                    DepotOrderId = o.DepotOrderId,
                    SalesOrderId = o.SalesOrderId,
                    CustomerId = o.CustomerId,
                    CustomerName = o.CustomerName,
                    CustomerEmail = o.CustomerEmail,
                    PhoneNumber = o.PhoneNumber,
                    OrderDate = o.OrderDate,
                    DeliveryDate = o.DeliveryDate,
                    ReissuedAt = o.ReissuedAt
                }).ToList(),
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                CurrentPage = result.CurrentPage
            };
        }
    }
}
