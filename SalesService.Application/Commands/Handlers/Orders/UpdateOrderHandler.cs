using SalesService.Application.Exceptions;
using SalesService.Infrastructure.Persistence;
using SalesService.Domain.Entities;
using SalesService.Infraestructure;
using Microsoft.EntityFrameworkCore;
using SalesService.Application.Commands.Orders;

namespace SalesService.Application.Commands.Handlers.Orders
{
    public class UpdateOrderHandler
    {
        private readonly SalesDbContext _context;

        public UpdateOrderHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task HandleAsync(UpdateOrderCommand cmd)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == cmd.OrderId);

            if (order == null)
                throw new ValidationException("Order not found.");
            if (order.Status == "Confirmed")
                throw new ValidationException("Cannot modify a confirmed order.");

            order.Items.Clear();
            order.Items = cmd.Products.Select(p => new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Order = order, // Fix: Set the required 'Order' property
                ProductName = p.ProductName,
                Quantity = p.Quantity,
                UnitPrice = p.UnitPrice
            }).ToList();

            order.DeliveryDetail = cmd.DeliveryDetail;
            order.TotalAmount = order.Items.Sum(i => i.Quantity * i.UnitPrice);

            await _context.SaveChangesAsync();
        }
    }
}

