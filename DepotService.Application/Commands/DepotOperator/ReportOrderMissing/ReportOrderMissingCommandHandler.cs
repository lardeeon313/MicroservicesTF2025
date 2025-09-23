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

            if (order.Status != OrderStatus.InPreparation && order.Status != OrderStatus.MissingProduct)
            {
                _logger.LogError($"Order with ID {command.DepotOrderId} is not in progress.");
                throw new InvalidOperationException($"Order with ID {command.DepotOrderId} is not in progress.");
            }
            //
            foreach (var missingItem in command.MissingItems)
            {
                var orderItem = order.Items.FirstOrDefault(i => i.Id == missingItem.OrderItemId);
                if (orderItem == null)
                {
                    throw new KeyNotFoundException($"Order item with ID {missingItem.OrderItemId} not found in the order.");
                }

                if (missingItem.Quantity > orderItem.Quantity)
                {
                    throw new InvalidOperationException(
                        $"Cantidad reportada para '{orderItem.ProductName}' ({missingItem.Quantity}) " +
                        $"no puede ser mayor a la cantidad pedida ({orderItem.Quantity})."
                    );
                }
            }
            //

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
                    SalesOrderItemId = order.Items.Select(i => i.SalesOrderItemId).FirstOrDefault(),
                    MissingQuantity = item.Quantity,
                    ProductName = item.ProductName,
                    ProductBrand = item.ProductBrand,
                    Packaging = item.Packaging,
                }).ToList(),
            };

            await _repository.AddMissing(missing);
            /// <summary>
            /// Basicamente si el operario emite un faltante , uno solo 
            /// El estado del pedido cambia a Inpreparation a MissingProduct
            /// Indicando que se presentaron tal faltanes de dicho pedido 
            /// </summary>
            order.Status = OrderStatus.MissingProduct;
            await _repository.UpdateOrderAsync(order);
            await _context.SaveChangesAsync();

            var statusHistory = new OrderStatusHistory
            {
                OrderId = order.DepotOrderId,
                OldStatus = order.Status,
                NewStatus = OrderStatus.MissingProduct,
                ChangedAt = DateTime.UtcNow,
            };
            // Agregar el historial de estado a la base de datos
            await _context.OrderStatusHistories.AddAsync(statusHistory);
            await _context.SaveChangesAsync();

            //Construye el mensaje detallando los productos donde se produjo el faltante: 
            var productList = string.Join(", ", missing.MissingItems
                .Select(i => $"{i.ProductName.Trim()} ({i.ProductBrand.Trim()}) x{i.MissingQuantity}"));

            var notificationMessage =
                $"Faltante detectado en el pedido #{command.DepotOrderId}: {productList}";

            // Log en consola
            _logger.LogInformation(notificationMessage);

            _logger.LogInformation($"Order with ID {command.DepotOrderId} reported as missing by operator {command.OperatorUserId}.");
        }
    }
}
