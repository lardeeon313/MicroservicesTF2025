using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.IRepositories
{
    public interface ILogisticOrderRepository
    {        
        Task<IEnumerable<LogisticOrder>> GetAllAsync();
        Task<LogisticOrder?> GetByIdAsync(int id);
        Task AddAsync(LogisticOrder order);
        Task UpdateAsync(LogisticOrder order);        
        Task<IEnumerable<LogisticOrder>> GetOrdersByStatus(OrderStatus status);
        Task<(List<LogisticOrder> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<IEnumerable<LogisticOrder>> GetOrdersByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByTeamId(int teamId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByOperatorId(Guid operatorId);
        Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryZoneId(int zoneId);
        Task AddStatusHistoryAsync(OrderStatusHistory statusHistory);
        Task<IEnumerable<LogisticOrder>> GetOrdersByDeliveryPriorityAsync(DeliveryPriority priority);


        
        // QUERIES PARA OPERADORES DE REPARTO
        Task<List<LogisticOrder>> GetMyAssignedOrders(Guid operatorId);
        Task<List<LogisticOrder>> GetMyDeliveredOrders(Guid operatorId);
        Task<List<LogisticOrder>> GetMyPendingCashOrders(Guid operatorId);
        Task<List<LogisticOrder>> GetMyPendingDeliveredOrders(Guid operatorId);
        Task<List<LogisticOrder>> GetMyOnTheWayOrders(Guid operatorId);
        Task<List<LogisticOrder>> GetMyOrdersWithDeliveryIncident(Guid operatorId);
        Task<List<LogisticOrder>> GetMyRejectOrders(Guid operatorId);

        // DELIVERY REJECTIONS REASONS
        Task AddDeliveryRejectionAsync(DeliveryRejectionReason rejectionReason);
        Task<IEnumerable<DeliveryRejectionReason>> GetRejectionReasonsByOrderIdAsync(int logisticOrderId);
        Task<List<LogisticOrder>> GetOrdersWithDeliveryRejectionsAsync();
        Task<List<LogisticOrder>> GetOrdersWithDeliveryIncidentsAsync();

        // DELIVERY INCIDENTS
        Task AddDeliveryIncidentAsync(DeliveryIncident incident);       
        Task<DeliveryIncident?> GetDeliveryIncidentByIdAsync(int id);
        Task<List<DeliveryIncident>> GetDeliveryIncidentByOrderIdAsync(int logisticOrderId);
        Task UpdateDeliveryIncidentAsync(DeliveryIncident incident);

        //NUEVO METODO REPORTE ; PERMITE OBTENER EL TIEMPO PROMEDIO ENTRE LOS CAMBIOS DE ESTADOS: 
        Task<OrderStatusHistory?> GetLastStatusHistoryAsync(int orderId);
    }
}
