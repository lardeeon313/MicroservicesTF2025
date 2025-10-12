using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder
{
    public class RemoveAssignOrderCommandHandler(ILogisticOrderRepository repository, ILogger<RemoveAssignOrderCommandHandler> logger) : IRemoveAssignOrderCommandHandler
    {
        private readonly ILogisticOrderRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly ILogger<RemoveAssignOrderCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        /// <summary>
        /// handler para remover la asignación de una orden a un operario y su equipo.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>       
        public async Task<bool> RemoveAssignOrder(RemoveAssignOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.LogisticOrderId);
            if (order == null)
                throw new KeyNotFoundException($"Order with ID {command.LogisticOrderId} not found.");

            order.RemoveAssignment();
            await _repository.UpdateAsync(order);
            _logger.LogInformation("✅ Orden {Id} desasignada del operador", order.DepotOrderId);
            
            return true;
        }
    }
}
