using SalesService.Application.Commands.Orders;
using SalesService.Application.Exceptions;
using SalesService.Infraestructure;
using SalesService.Infrastructure.Persistence;

namespace SalesService.Application.Commands.Handlers.Orders
{
    public class AttachReceiptHandler
    {
        private readonly SalesDbContext _context;

        public AttachReceiptHandler(SalesDbContext context)
        {
            _context = context;
        }

        public async Task HandleAsync(AttachReceiptCommand cmd)
        {
            var order = await _context.Orders.FindAsync(cmd.OrderId);
            if (order == null)
                throw new ValidationException("Order not found.");
            if (order.Status != "Issued")
                throw new ValidationException("Can only attach receipt to issued orders.");

            order.PaymentReceipt = cmd.Base64File;
            await _context.SaveChangesAsync();
        }
    }
}

