using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllOrders
{
    public class GetAllOrdersQueryHandler(DepotDbContext context, IDepotOrderRepository repository, ILogger<GetAllOrdersQueryHandler> logger) : IGetAllOrdersQueryHandler
    {
        private readonly DepotDbContext _context = context;
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetAllOrdersQueryHandler> _logger = logger;

        /// <summary>
        /// Handler para obtener todas las órdenes en el depósito.
        /// </summary>
        /// <returns></returns>
        public Task<IEnumerable<DepotOrderEntity?>> AllOrdersHandleAsync()
        {
            try
            {
                var orders = _repository.GetAllAsync().Result;

                if (orders == null || !orders.Any())
                {
                    _logger.LogWarning("No orders found");
                    throw new Exception("No orders found");
                }

                return Task.FromResult(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders");
                throw;
            }
        }
    }
}
