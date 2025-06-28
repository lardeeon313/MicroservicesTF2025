using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.BillingManager.SetItemUnitPrices
{
    public class SetItemUnitPricesCommandHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<SetItemUnitPricesCommandHandler> logger) : ISetItemUnitPricesCommandHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<SetItemUnitPricesCommandHandler> _logger = logger;

        /// <summary>
        /// handler to set item unit prices for a depot order
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> SetItemUnitPriceHandlerAsync(SetItemUnitPricesCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.DepotOrderId);
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }
            if (order.Status != OrderStatus.SentToBilling)
            {
                _logger.LogWarning("Order with ID {OrderId} is not in the correct status to set item unit prices.", command.DepotOrderId);
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in the correct status to set item unit prices.");
            }

            foreach (var item in command.ItemUnitPrices)
            {
                var orderItem = order.Items.FirstOrDefault(i => i.Id == item.ItemId);
                if (orderItem == null)
                {
                    _logger.LogWarning("Item with ID {ItemId} not found in order {OrderId}.", item.ItemId, command.DepotOrderId);
                    throw new KeyNotFoundException($"Item with ID {item.ItemId} not found in order {command.DepotOrderId}.");
                }

                orderItem.UnitPrice = item.UnitPrice;
            }

            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            if (order.Items.Any(i => i.UnitPrice != null || i.UnitPrice > 0))
            {
                order.TotalAmount = order.Items.Sum(i => (i.UnitPrice ?? 0) * i.Quantity);
                _logger.LogInformation("Total amount for order ID {OrderId} updated to {TotalAmount}.", command.DepotOrderId, order.TotalAmount);
            }

            _logger.LogInformation("Item unit prices set successfully for order ID {OrderId}.", command.DepotOrderId);

            return true;
        }
    }
}
