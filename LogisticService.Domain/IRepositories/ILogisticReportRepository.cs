using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.ValueObjects;
using SharedKernel.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.IRepositories
{
    public interface ILogisticReportRepository
    {
        Task<List<LogisticOrder>> GetFilteredOrdersAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId,
            Guid? operatorId,
            PaymentType? paymentType);

        Task<PagedResult<DeliveryIncident>> GetDeliveryIncidentsReportQuery(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId,
            Guid? operatorId,
            bool? resolved,
            int pageNumber,
            int pageSize);

        Task<PagedResult<DeliveryRejectionReason>> GetDeliveryRejectionsAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId,
            Guid? operatorId,
            int pageNumber,
            int pageSize);

        Task<List<ZonePerformanceReport>> GetZonePerformanceAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId);

        Task<List<TeamActivityReport>> GetDeliveryTeamActivityAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryTeamId,
            int? deliveryZoneId);

        Task<PagedResult<CustomerIncidentReport>> GetCustomersWithMostIncidentsAsync(
            DateTime? startDate,
            DateTime? endDate,
            Guid? customerId,
            string? incidentType,
            int pageNumber,
            int pageSize);

        Task<PagedResult<OrderStatusHistoryReport>> GetOrderStatusHistoryAsync(
            DateTime? startDate,
            DateTime? endDate,
            OrderStatus? oldStatus,
            OrderStatus? newStatus,
            Guid? operatorId,
            int pageNumber,
            int pageSize);

        Task<PagedResult<LogisticOrder>> GetPendingCashVerificationAsync(
            DateTime? startDate,
            DateTime? endDate,
            Guid? operatorId,
            int? deliveryTeamId,
            int pageNumber,
            int pageSize);





    }
}
