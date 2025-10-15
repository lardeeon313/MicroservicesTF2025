using Microsoft.Extensions.Logging;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers
{
    public class DesactivateCustomerCommandHandler(ICustomerRepository repository, ILogger<DesactivateCustomerCommandHandler> logger) : IDesactivateCustomerCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;
        private readonly ILogger<DesactivateCustomerCommandHandler> _logger = logger;
        public async Task<bool> DesactivateCustomerHandlerAsync(DesactivateCustomerCommand command)
        {
            // validamos que el cliente exista
            var customerExist = await _repository.GetByIdAsync(command.CustomerId);
            if (customerExist == null)
            {
                _logger.LogWarning("No existe un cliente con este ID : {CustomerId}", command.CustomerId);
                return false;
            }

            customerExist.Desactivate();
            _logger.LogWarning("Se ha Desactivado el cliente con el ID: {CustomerId} ", command.CustomerId);

            await _repository.UpdateAsync(customerExist);

            return true;
        }
    }
}
