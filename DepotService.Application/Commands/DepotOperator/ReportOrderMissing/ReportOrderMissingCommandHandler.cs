using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ReportOrderMissing
{
    public class ReportOrderMissingCommandHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<ReportOrderMissingCommandHandler> logger) : IReportOrderMissingCommandHandler
    {
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IDepotOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<ReportOrderMissingCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// Handler para reportar un pedido como faltante en el Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task HandleAsync(ReportOrderMissingCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} not found.");
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");
            }

            if (order.AssignedOperatorId != command.OperatorUserId)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not assigned to operator {command.OperatorUserId}.");
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not assigned to operator {command.OperatorUserId}.");
            }

            if (order.Status != OrderStatus.InPreparation)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not in progress.");
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in progress.");
            }

            var missing = new DepotOrderMissing
            {
                SalesOrderId = order.SalesOrderId,
                DepotOrderId = command.DepotOrderId,
                MissingReason = command.MissingReason,
                MissingDescription = command.MissingDescription,
                MissingDate = DateTime.UtcNow,
                MissingItems = command.MissingItems.Select(item => new DepotOrderMissingItem
                {
                    DepotOrderItemId = item.OrderItemId,
                    MissingQuantity = item.Quantity,
                    ProductName = item.ProductName,
                    ProductBrand = item.ProductBrand,
                    Packaging = item.Packaging,
                }).ToList(),
            };

            await _repository.AddMissing(missing);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Order with ID {command.DepotOrderId} reported as missing by operator {command.OperatorUserId}.");
        }
    }
}
