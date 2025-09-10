using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice
{
    public class UpdateInvoicedItemPriceCommandHandler(DepotDbContext context, IDepotOrderRepository repository, ILogger<UpdateInvoicedItemPriceCommandHandler> logger) : IUpdateInvoicedItemPriceCommandHandler
    {
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<UpdateInvoicedItemPriceCommandHandler> _logger = logger;

        /// <summary>
        /// Handles the command to update the price of an invoiced item.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> UpdateInvoicedItemPrice(UpdateInvoicedItemPriceCommand command)
        {
            var order = await _repository.GetByIdAsync(command.BillingOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.BillingOrderId);
                throw new KeyNotFoundException($"Order with ID {command.BillingOrderId} not found.");
            }

            var item = order.Items.FirstOrDefault(i => i.Id == command.ItemId);
            if (item == null)
            {
                _logger.LogWarning("Item with ID {ItemId} not found in order {OrderId}.", command.ItemId, command.BillingOrderId);
                throw new KeyNotFoundException($"Item with ID {command.ItemId} not found in order {command.BillingOrderId}.");
            }

            item.UnitPrice = command.NewUnitPrice;

            // Recalcular el total
            item.Total = item.UnitPrice.HasValue ? item.UnitPrice.Value * item.Quantity : 0;
            order.TotalAmount = order.Items.Sum(i => i.Total ?? 0);
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated item price for item ID {ItemId} in order ID {OrderId}.", command.ItemId, command.BillingOrderId);

            return true;
        }
    }
}
