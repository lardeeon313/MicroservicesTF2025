using DepotService.Application.DTOs.Pagination;
using DepotService.Domain.Enums;
using DepotService.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.IRepositories
{
    public interface IDepotReportRepository
    {
        Task<List<OrderStatusAverage>> GetAverageTimePerStatusAsync(DateTime? from, DateTime? to);
        Task<List<OrderStatusCount>> GetOrderCountPerStatusAsync(DateTime? from, DateTime? to);
        Task<PaginatedResult<OrderProcessingTime>> GetAverageProcessingTimePerOrderAsync(DateTime? from, DateTime? to, string? operatorId, string? customer, int page, int pageSize);
        Task<List<DepotTeamPerformance>> GetDepotTeamPerformancesAsync(DateTime? from, DateTime? to, bool agruparPorEquipo);
        Task<PaginatedResult<OrderByDeliveryDate>> GetOrdersByDeliveryDateAsync(DateTime? from, DateTime? to, int page, int pageSize);
        Task<PaginatedResult<ReissuedOrderReport>> GetReissuedOrdersAsync(DateTime? from, DateTime? to, int page, int pageSize);
        Task<PaginatedResult<CompletedOrdersReport>> GetCompletedOrdersAsync(DateTime? from, DateTime? to, int page, int pageSize);
        Task<PaginatedResult<OrdersInPreparation>> GetOrdersInPreparationAsync(int page, int pageSize, DateTime? from, DateTime? to);
    }
}
