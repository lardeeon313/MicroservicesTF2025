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

        public async Task<IEnumerable<SalesPerfomanceDto>> Handle()
        {
            var orders = await _repository.GetAllWithItemsAsync();
            var salesStaffs = await _identityClient.GetSalesStaffsAsync();

            // Debug: Mostramos los IDs
            Console.WriteLine("CreatedByUserIds en órdenes:");
            foreach (var o in orders.Select(x => x.CreatedByUserId).Distinct())
                Console.WriteLine($"  -> {o}");

            Console.WriteLine("IDs devueltos por Identity:");
            foreach (var s in salesStaffs)
                Console.WriteLine($"  -> {s.Id}");

            var perfomance = orders
                .GroupBy(o => o.CreatedByUserId)
                .Select(group => 
                {
                    var user = salesStaffs.FirstOrDefault(u => u.Id == group.Key);
                    return new SalesPerfomanceDto
                    {
                        SalespersonName = user?.FirstName ?? "Desconocido",
                        TotalOrders = group.Count(),
                        TotalUnitsSold = group.SelectMany(o => o.Items).Sum(i => i.Quantity),
                        LastOrderDate = group.Max(o => o.OrderDate)

                    };
                });

            return perfomance;
        }
    }
}
