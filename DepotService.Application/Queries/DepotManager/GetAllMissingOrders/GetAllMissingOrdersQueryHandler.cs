using DepotService.Application.DTOs.DepotManager;
using DepotService.Application.Queries.DepotManager.GetMissingOrderById;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetAllMissingOrders
{
    public class GetAllMissingOrdersQueryHandler(IDepotOrderRepository repository, ILogger<GetMissingOrderByIdQueryHandler> logger, DepotDbContext context) : IGetAllMissingOrdersQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetMissingOrderByIdQueryHandler> _logger = logger;
        private readonly DepotDbContext _context = context;

        /// <summary>
        /// Handler para devolver todas las órdenes faltantes en el depósito.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<IEnumerable<DepotOrderMissingDto>> GetAllMissingOrdersAsync()
        {
            var ordersExists = await _repository.GetMissingOrdersAsync();

            if (ordersExists == null || !ordersExists.Any())
            {
                _logger.LogError("No missing orders found.");
                throw new Exception("No missing orders found.");
            }

            var ordersMissingDtos = ordersExists.Select(order => new DepotOrderMissingDto
            {
                MissingId = order.MissingId,
                DepotOrderId = order.DepotOrderId,
                SalesOrderId = order.SalesOrderId,
                MissingReason = order.MissingReason,
                MissingDescription = order.MissingDescription,
                MissingItems = order.MissingItems,
                DescriptionResolution = order.DescriptionResolution,
                MissingDate = order.MissingDate,
                DepotOrder = order.DepotOrder
            });

            _logger.LogInformation("All missing orders retrieved successfully.");

            return ordersMissingDtos;

        }
    }
}
