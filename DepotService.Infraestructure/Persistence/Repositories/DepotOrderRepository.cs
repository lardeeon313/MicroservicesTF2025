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
            //MODIFICADO PARA TRAER LOS PRODUCTOS DENTRO DEL DETAILORDER 
            /*return await _context.DepotOrders
                .FirstOrDefaultAsync(o => o.DepotOrderId == depotOrderId);*/
            return await _context.DepotOrders
                .Include(o => o.Items)
                .Include(o => o.Missings)
                    .ThenInclude(m => m.MissingItems)
                .FirstOrDefaultAsync(o => o.DepotOrderId == depotOrderId);
        }

        public async Task<IEnumerable<DepotOrderEntity>> GetAllAsync()
        {
            return await _context.DepotOrders
                .Include(x => x.Items)
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
                .Include(o => o.Missings)
                .Where(o => o.AssignedOperatorId == operatorId &&
                        //(o.Status == OrderStatus.Assigned || o.Status == OrderStatus.ReReceived))
                        (o.Status == OrderStatus.InPreparation))
                .ToListAsync();
        }
        //METODO PARA TRAER TODOS LOS PEDIDOS TANTO EN PREPARACION O FALTANTE PARA 'PEDIDOS CON FALTANTES'
        public async Task<IEnumerable<DepotOrderEntity>> GetWithInPreparationOrMissingAsync(Guid operatorId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
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

        public Task<List<DepotOrderEntity>> GetAssignedPendingOrdersByOperatorIdAsync()
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.AssignedOperatorId != null &&
                            (o.Status == OrderStatus.Assigned || o.Status == OrderStatus.ReReceived))
                .ToListAsync();
        }

        public Task<List<DepotOrderEntity>> GetOrdersPendingBillingAsync()
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.Status == OrderStatus.SentToBilling)
                .ToListAsync();
        }

        public Task<List<DepotOrderEntity>> GetAllInvoicedOrdersAsync()
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.Status == OrderStatus.Invoiced)
                .ToListAsync();
        }

        public Task<List<DepotOrderEntity>> GetInvoicedOrdersByDateRangeAsync(DateTime StartTime, DateTime EndTime)
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.Status == OrderStatus.Invoiced &&
                            o.OrderDate >= StartTime && o.OrderDate <= EndTime)
                .ToListAsync();
        }

        public Task<List<DepotOrderEntity>> GetInvoicedOrdersByCustomerAsync(Guid customerId)
        {
            return _context.DepotOrders
                .Include(o => o.Items)
                .Where(o => o.Status == OrderStatus.Invoiced && o.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<DepotOrderEntity?> GetBySalesIdAsync(int salesOrderId)
        {
            return await _context.DepotOrders
                .Include(o => o.Items)
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
