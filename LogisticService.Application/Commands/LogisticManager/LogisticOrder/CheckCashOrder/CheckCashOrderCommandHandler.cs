using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder
{
    public class CheckCashOrderCommandHandler(ILogisticOrderRepository repository, ILogger<CheckCashOrderCommandHandler> handler) : ICheckCashOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<CheckCashOrderCommandHandler> _logger = handler ?? throw new ArgumentNullException(nameof(handler));

        /// <summary>
        /// handler para verificar una orden de pago en efectivo.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> CheckCashHandleAsync(CheckCashOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", command.LogisticOrderId);
                return false;
            }                

            _logger.LogInformation("Attempting cash verification for order ID {OrderId}.", command.LogisticOrderId);

            order.CheckCash();

            await _repository.UpdateAsync(order);

            _logger.LogInformation("Order ID {OrderId} marked as cash verified.",
                command.LogisticOrderId);
            return true;
        }
    }
}
