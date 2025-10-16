using Microsoft.Extensions.Logging;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerPaymentTypes
{
    public class GetCustomerPaymentTypesQueryHandler(ICustomerRepository repository, ILogger<GetCustomerPaymentTypesQueryHandler> logger) : IGetCustomerPaymentTypesQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;
        private readonly ILogger<GetCustomerPaymentTypesQueryHandler> _logger = logger;

        /// <summary>
        /// query para obtener los tipos de pago asociados a un cliente específico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<List<CustomerPaymentType>> HandleAsync(GetCustomerPaymentTypesQuery query)
        {
            var paymentTypes = await _repository.GetPaymentTypesByCustomerIdAsync(query.CustomerId);
            if (paymentTypes == null || !paymentTypes.Any())
            {
                _logger.LogWarning($"No payment types found for customer ID {query.CustomerId}");
                return new List<CustomerPaymentType>();
            }

            return paymentTypes;
        }
    }
}
