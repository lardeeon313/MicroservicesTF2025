using SalesService.Application.DTOs.Order;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.GetSalesPerfomanceReport
{
    public class GetSalesPerfomanceReportQueryHandler(IOrderRepository repository, IIdentityServiceClient identityClient) : IGetSalesPerfomanceReportQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        private readonly IIdentityServiceClient _identityClient = identityClient;

        public async Task<IEnumerable<SalesPerfomanceDto>> Handle(GetSalesPerformanceReportQuery query)
        {
            var orders = await _repository.GetAllWithItemsAsync();
            DateTime now = DateTime.UtcNow;

            // Filtro por fechas "from" y "to"
            if (query.DateFrom.HasValue)
                orders = orders.Where(o => o.OrderDate >= query.DateFrom.Value).ToList();
            if (query.DateTo.HasValue)
                orders = orders.Where(o => o.OrderDate <= query.DateTo.Value).ToList();

            // Agrupar y calcular los resultados
            var currentUser = await _identityClient.GetCurrentUserAsync();
            var performance = orders
                .GroupBy(o => o.CreatedByUserId)
                .Select(group =>
                {
                    var user = currentUser;
                    return new SalesPerfomanceDto
                    {
                        SalespersonName = $"{user?.FirstName} {user?.LastName}".Trim(),
                        TotalOrders = group.Count(),
                        TotalUnitsSold = group.SelectMany(o => o.Items).Sum(i => i.Quantity),
                        LastOrderDate = group.Max(o => o.OrderDate)
                    };
                })
                .ToList();

            // Aplicar filtro de rango después de agrupar
            if (query.Range != SalesRangeReport.All)
            {
                DateTime? limitDate = query.Range switch
                {
                    SalesRangeReport.Quincena => now.AddDays(-15),
                    SalesRangeReport.Mensual => now.AddMonths(-1),
                    SalesRangeReport.Trimestral => now.AddMonths(-3),
                    SalesRangeReport.Semestral => now.AddMonths(-6),
                    SalesRangeReport.Anual => now.AddYears(-1),
                    _ => null
                };

                if (limitDate.HasValue)
                {
                    
                    performance = performance.Where(p => p.LastOrderDate >= limitDate.Value).ToList();
                    
                }
            }

            return performance;
        }


    }
}
