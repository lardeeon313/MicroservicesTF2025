using Microsoft.EntityFrameworkCore;
using SalesService.Domain.Entities;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Infraestructure.Persistence.Repositories
{
    public class OrderRepository(SalesDbContext context) : IOrderRepository
    {
        private readonly SalesDbContext _context = context;

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
        //
        public async Task AddAddressAsync(Address address)
        {
            await _context.Addresses.AddAsync(address);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Address guardado con Id: {address.Id}");
        }

        public Task AttachReceiptAsync(int orderId, string receiptBase64)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Order order)
        {
            _context.Orders.Remove(order);
            return _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Customer)
                .Include(o => o.DeliveryAddress)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetAllWithItemsAsync()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .Where(o => o.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Addresses)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                throw new ArgumentException($"Invalid status value: {status}");

            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.DeliveryAddress)
                .AsNoTracking()
                .Where(o => o.Status == parsedStatus)
                .ToListAsync();
        }

        public async Task<DateTime?> GetLastOrderDateByCustomerId(Guid customerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => (DateTime?)o.OrderDate)
                .FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<OrderMissing>> GetMissingOrdersAsync()
        {
            return await _context.OrderMissings
                .Include(om => om.Order) // Carga la entidad 'Order'
                    .ThenInclude(o => o.Items) // Luego, carga la entidad 'Customer'
                .Include(om => om.Order.DeliveryAddress) // Carga la entidad Address relacionada con Order
                .Include(om => om.Order.Customer) // Carga la entidad 'Customer' relacionada con 'Order'
                .Include(om => om.MissingItems) // También cargas los 'MissingItems'
                .ToListAsync();
        }

        public async Task<(List<Order> Orders, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.DeliveryAddress)
                .OrderByDescending(o => o.OrderDate);

            var totalCount = await query.CountAsync(cancellationToken);

            var orders = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (orders, totalCount);
        }

        public async Task UpdateAsync(Order order)
        {
            foreach (var item in order.Items.Where(i => i.Id == 0))
            {
                _context.Entry(item).State = EntityState.Added;
            }
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }


        public async Task<OrderSatisfactionToken?> GetOrderSatisfactionByTokenAsync(string token)
        {
            return await _context.OrderSatisfactionTokens
                .Include(x => x.Order)
                    .ThenInclude(o => o.Items)
                .FirstOrDefaultAsync(x => x.Token == token);
        }

        public async Task AddSatisfactionTokenAsync(OrderSatisfactionToken token)
        {
            await _context.OrderSatisfactionTokens.AddAsync(token);
        }

        //
        public async Task AddOrderSatisfactionAsync(OrderSatisfaction satisfaction)
        {
            await _context.OrderSatisfactions.AddAsync(satisfaction);
        }
        public async Task<bool> OrderHasSatisfactionAsync(int orderId)
        {
            return await _context.OrderSatisfactions
                .AnyAsync(x => x.OrderId == orderId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
