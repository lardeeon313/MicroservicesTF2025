using SalesService.Application.DTOs.Order;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetSalesPerfomanceReport
{
    public class GetSalesPerfomanceReportQueryHandler(IOrderRepository repository, IIdentityServiceClient identityClient) : IGetSalesPerfomanceReportQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        private readonly IIdentityServiceClient _identityClient = identityClient;

        public async Task<IEnumerable<SalesPerfomanceDto>> Handle(GetSalesPerformanceReportQuery query)
        {
            var orders = await _repository.GetAllWithItemsAsync();

            // Filtro por rangos de fecha
            if(query.DateFrom.HasValue)
            {
                orders = orders.Where(o => o.OrderDate >= query.DateFrom.Value).ToList();
            }

            if(query.DateTo.HasValue)
            {
                orders = orders.Where(o => o.OrderDate <= query.DateTo.Value).ToList();
            }

            var currentUser = await _identityClient.GetCurrentUserAsync();

            var perfomance = orders
                .GroupBy(o => o.CreatedByUserId)
                .Select(group => 
                {
                    var user = currentUser; // ya tenemos el único usuario
                    return new SalesPerfomanceDto
                    {
                        SalespersonName = $"{user?.FirstName} {user?.LastName}".Trim(),
                        TotalOrders = group.Count(),
                        TotalUnitsSold = group.SelectMany(o => o.Items).Sum(i => i.Quantity),
                        LastOrderDate = group.Max(o => o.OrderDate)
                    };
                });

            return perfomance;
        }
    }
}
