using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using LogisticService.Domain.ValueObjects;
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

        Task<List<DeliveryIncident>> GetDeliveryIncidentsReportQuery(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId,
            Guid? operatorId,
            bool? resolved);

        Task<List<DeliveryRejectionReason>> GetDeliveryRejectionsAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? deliveryZoneId,
            int? deliveryTeamId,
            Guid? operatorId);

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

        Task<List<CustomerIncidentReport>> GetCustomersWithMostIncidentsAsync(
            DateTime? startDate,
            DateTime? endDate,
            Guid? customerId,
            string? incidentType);

        Task<List<OrderStatusHistoryReport>> GetOrderStatusHistoryAsync(
            DateTime? startDate,
            DateTime? endDate,
            OrderStatus? oldStatus,
            OrderStatus? newStatus,
            Guid? operatorId);

        Task<List<LogisticOrder>> GetPendingCashVerificationAsync(
            DateTime? startDate,
            DateTime? endDate,
            Guid? operatorId,
            int? deliveryTeamId);





    }
}
