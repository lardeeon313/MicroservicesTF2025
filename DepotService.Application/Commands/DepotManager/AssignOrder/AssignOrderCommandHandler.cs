using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.AssignOrder
{
    public class AssignOrderCommandHandler(IDepotOrderRepository repository, DepotDbContext context, ILogger<AssignOrderCommandHandler> logger) : IAssignOrderCommandHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly DepotDbContext _context = context;
        private readonly ILogger<AssignOrderCommandHandler> _logger = logger;

        public async Task HandleAsync(AssignOrderCommand command)
        {
            var order = await _repository.GetByIdAsync(command.DepotOrderId);
            if (order == null)
                throw new KeyNotFoundException($"Order with ID {command.DepotOrderId} not found.");

            order.AssignToOperator(command.OperatorId, command.OperatorName);

            await _context.SaveChangesAsync();
            _logger.LogInformation("✅ Orden {Id} asignada al operador {Operator}", order.DepotOrderId, command.OperatorName);

        }
    }
}
