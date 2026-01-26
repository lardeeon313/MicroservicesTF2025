using SalesService.Application.DTOs.Order;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Data;

namespace SalesService.Application.Queries.Reports.GetSalesPerfomanceReport
{
    public class GetSalesPerfomanceReportQueryHandler
        : IGetSalesPerfomanceReportQueryHandler
    {
        private readonly IOrderRepository _repository;
        private readonly IIdentityServiceClient _identityClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetSalesPerfomanceReportQueryHandler(
            IOrderRepository repository,
            IIdentityServiceClient identityClient,
            IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _identityClient = identityClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<SalesPerfomanceDto>> Handle(GetSalesPerformanceReportQuery query)
        {
            var orders = await _repository.GetAllWithItemsAsync();
            DateTime now = DateTime.UtcNow;

            // ==============================
            // ROL DESDE JWT
            // ==============================
            var role = _httpContextAccessor.HttpContext?
                .User?
                .Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.Role || c.Type == "role")
                ?.Value;

            var currentUser = await _identityClient.GetCurrentUserAsync();

            // 👉 SI ES VENDEDOR, SOLO SUS ÓRDENES
            if (string.Equals(role, "SalesStaff", StringComparison.OrdinalIgnoreCase))
            {
                orders = orders
                    .Where(o => o.CreatedByUserId == currentUser.Id)
                    .ToList();
            }

            // ==============================
            // FILTROS POR FECHA
            // ==============================
            if (query.DateFrom.HasValue)
                orders = orders
                    .Where(o => o.OrderDate >= query.DateFrom.Value)
                    .ToList();

            if (query.DateTo.HasValue)
                orders = orders
                    .Where(o => o.OrderDate <= query.DateTo.Value)
                    .ToList();

            // ==============================
            // OBTENER VENDEDORES
            // ==============================
            var salesStaffs = await _identityClient.GetSalesStaffsAsync();

            // ==============================
            // AGRUPAR Y CALCULAR
            // ==============================
            var performance = orders
                .GroupBy(o => o.CreatedByUserId)
                .Select(group =>
                {
                    var staff = salesStaffs
                        .FirstOrDefault(s => s.Id == group.Key);

                    return new SalesPerfomanceDto
                    {
                        SalespersonName = staff != null
                            ? $"{staff.FirstName} {staff.LastName}".Trim()
                            : "Usuario desconocido",

                        TotalOrders = group.Count(),

                        TotalUnitsSold = group
                            .SelectMany(o => o.Items)
                            .Sum(i => i.Quantity),

                        LastOrderDate = group.Max(o => o.OrderDate)
                    };
                })
                .ToList();

            // ==============================
            // FILTRO POR RANGO
            // ==============================
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
                    performance = performance
                        .Where(p => p.LastOrderDate >= limitDate.Value)
                        .ToList();
                }
            }

            return performance;
        }
    }
}
