using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.AddPackaing
{
    public class AddPackaingCommandHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<AddPackaingCommandHandler> logger) : IAddPackaingCommandHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<AddPackaingCommandHandler> _logger = logger;

        /// <summary>
        /// Handler para el comando de adición de empaques en el Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> AddPackaingAsync(AddPackagingCommand command)
        {
            var itemIds = command.PackaingItems.Select(item => item.DepotOrderItemId).ToList();

            var items = await _repository.GetOrderItemsByIdsAsync(itemIds);

            if (items == null || !items.Any())
            {
                _logger.LogError("No items found for the provided IDs.");
                throw new KeyNotFoundException("No items found for the provided IDs.");
            }

            foreach (var dto in command.PackaingItems)
            {
                var item = items.FirstOrDefault(i => i.Id == dto.DepotOrderItemId);
                if (item is null)
                    throw new KeyNotFoundException($"Item with ID {dto.DepotOrderItemId} not found.");

                var validStatuses = new[] { OrderStatus.ReReceived, OrderStatus.InPreparation, OrderStatus.Assigned };
                if (!validStatuses.Contains(item.DepotOrderEntity.Status))
                {
                    _logger.LogError($"Item with ID {item.Id} cannot be updated because its status is {item.DepotOrderEntity.Status}.");
                    throw new InvalidOperationException($"Item with ID {item.Id} cannot be updated because its status is {item.DepotOrderEntity.Status}.");
                }
                item.PackagingType = dto.PackaingType;
            }

            await _repository.UpdateDepotOrderItemsAsync(items);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Packaging items updated successfully.");
            return true;
        }
    }
}
