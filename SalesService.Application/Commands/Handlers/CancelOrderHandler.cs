using SalesService.Application.Commands;
using SalesService.Application.Exceptions;
using SalesService.Infraestructure;
using SalesService.Infrastructure.Persistence;

namespace SalesService.Application.Handlers
{
    public class CancelOrderHandler
    {
        private readonly SalesDbContext _context;

        public CancelOrderHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task HandleAsync(CancelOrderCommand cmd)
        {
            var order = await _context.Orders.FindAsync(cmd.OrderId);
            if (order == null)
                throw new ValidationException("Order not found.");
            if (order.Status == "Confirmed")
                throw new ValidationException("Cannot cancel a confirmed order.");

            order.Status = "Canceled";
            await _context.SaveChangesAsync();
        }
    }
}

