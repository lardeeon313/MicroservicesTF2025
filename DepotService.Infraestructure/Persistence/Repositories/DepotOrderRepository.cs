using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Infraestructure.Persistence.Repositories
{
    public class DepotOrderRepository : IDepotOrderRepository
    {
        private readonly DepotDbContext _context;

        public DepotOrderRepository(DepotDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(DepotOrderEntity order)
        {
            await _context.DepotOrders.AddAsync(order);
        }

        public async Task<DepotOrderEntity?> GetByIdAsync(int depotOrderId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Missings)
                    .ThenInclude(m => m.MissingItems)
                .FirstOrDefaultAsync(o => o.DepotOrderId == depotOrderId);
        }

        public async Task<IEnumerable<DepotOrderEntity>> GetAllAsync()
        {
            return await _context.DepotOrders
                .Include(x => x.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Missings)
                .ToListAsync();
        }

        public async Task UpdateOrderAsync(DepotOrderEntity order)
        {
            _context.DepotOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DepotOrderEntity>> GetOrderByStatusAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                throw new ArgumentException($"Invalid status value: {status}");

            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .Where(o => o.Status == parsedStatus)
                .ToListAsync();
        }

        public async Task<IEnumerable<DepotOrderMissing>> GetMissingOrdersAsync()
        {
            return await _context.DepotOrderMissings
                .Include(m => m.MissingItems)
                .Include(m => m.DepotOrder)
                .ToListAsync();
        }

        public async Task<DepotOrderMissing?> GetMissingOrderByIdAsync(int missingId)
        {
            return await _context.DepotOrderMissings
                .Include(m => m.MissingItems)
                .FirstOrDefaultAsync(m => m.MissingId == missingId);
        }

        public async Task AddMissingOrderAsync(DepotOrderMissing missingOrder)
        {
            await _context.DepotOrderMissings.AddAsync(missingOrder);
        }

        public async Task UpdateMissingOrderAsync(DepotOrderMissing missingOrder)
        {
            _context.DepotOrderMissings.Update(missingOrder);
            await _context.SaveChangesAsync();
        }

        //METODO PARA TRAER TODOS LOS PEDIDOS EN PREPARACION PARA 'PEDIDOS ARMADOS'
        public async Task<IEnumerable<DepotOrderEntity>> GetAllByOperatorIdAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Missings)
                .Where(o => o.AssignedOperatorId == operatorId &&
                        
                        (o.Status == OrderStatus.InPreparation))
                .ToListAsync();
        }
        //METODO PARA TRAER TODOS LOS PEDIDOS TANTO EN PREPARACION O FALTANTE PARA 'PEDIDOS CON FALTANTES'
        public async Task<IEnumerable<DepotOrderEntity>> GetWithInPreparationOrMissingAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Missings)
                .Where(o => o.AssignedOperatorId == operatorId &&
                       (o.Status == OrderStatus.InPreparation || o.Status == OrderStatus.MissingProduct))
                .ToListAsync();
        }

        //METODO PARA TRAER TODOS LOS PEDIDOS TANTO PREPARADOS COMO AQUELLOS QUE YA SEAN 'SENT TO BILLING'
        public async Task<IEnumerable<DepotOrderEntity>> GetPreparedOrSentToBillingAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include (o => o.Missings)
                .Where(o => o.AssignedOperatorId == operatorId &&
                        (o.Status == OrderStatus.Prepared || o.Status == OrderStatus.SentToBilling))
                .ToListAsync();
        }

        public async Task AddMissing(DepotOrderMissing missingOrder)
        {
            await _context.DepotOrderMissings.AddAsync(missingOrder);
            await _context.SaveChangesAsync();

        }

        public async Task<List<DepotOrderItemEntity>> GetOrderItemsByIdsAsync(List<int> ids)
        {
            //
            return await _context.DepotOrderItems
                .Include(item => item.DepotOrderEntity) //
                .Where(item => ids.Contains(item.Id))
                .ToListAsync();
        }

        public async Task UpdateDepotOrderItemsAsync(List<DepotOrderItemEntity> items)
        {
            foreach (var item in items)
            {
                _context.DepotOrderItems.Update(item);
            }
            await _context.SaveChangesAsync();
        }

        public async Task<List<DepotOrderEntity>> GetAssignedPendingOrdersByOperatorIdAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Where(o =>
                    o.AssignedOperatorId == operatorId &&
                    (o.Status == OrderStatus.Assigned || o.Status == OrderStatus.ReReceived)
                )
                .ToListAsync();
        }

        public async Task<List<DepotOrderEntity>> GetOrdersPendingBillingAsync()
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Where(o => o.Status == OrderStatus.SentToBilling)
                .ToListAsync();
        }

        public async Task<List<DepotOrderEntity>> GetAllInvoicedOrdersAsync()
        {
            var invoicedAndBeyond = new[]
            {
                OrderStatus.Invoiced,
                OrderStatus.Issued,
                OrderStatus.OnTheWay,
                OrderStatus.Delivered,
                OrderStatus.Verify,
                OrderStatus.AssignedDelivery,
                OrderStatus.PendingDelivered,
                OrderStatus.PendingIncidentResolution,
                OrderStatus.IncidentResolved,
            };

            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Where(o => invoicedAndBeyond.Contains(o.Status))
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public Task<List<DepotOrderEntity>> GetInvoicedOrdersByDateRangeAsync(DateTime StartTime, DateTime EndTime)
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Where(o => o.Status == OrderStatus.Invoiced &&
                            o.OrderDate >= StartTime && o.OrderDate <= EndTime)
                .ToListAsync();
        }

        public async Task<List<DepotOrderEntity>> GetInvoicedOrdersByCustomerAsync(string customerName)
        {
            return await _context.DepotOrders
                .Where(o => o.CustomerName.Contains(customerName))
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.StatusHistory)
                .ToListAsync();
        }

        public async Task<DepotOrderEntity?> GetBySalesIdAsync(int salesOrderId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Missings)
                    .ThenInclude(m => m.MissingItems)
                .FirstOrDefaultAsync(o => o.SalesOrderId == salesOrderId);
        }

        public async Task DeleteOrderByIdAsync(int depotOrderId)
        {
            await _context.DepotOrders
                .Where(o => o.DepotOrderId == depotOrderId)
                .ExecuteDeleteAsync();
        }
    }
}
