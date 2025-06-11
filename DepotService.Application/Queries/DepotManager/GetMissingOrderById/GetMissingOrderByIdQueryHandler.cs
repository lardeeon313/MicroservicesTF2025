using DepotService.Application.DTOs.DepotManager;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.DepotManager.GetMissingOrderById
{
    public class GetMissingOrderByIdQueryHandler(IDepotOrderRepository repository, ILogger<GetMissingOrderByIdQueryHandler> logger, DepotDbContext context) : IGetMissingOrderByIdQueryHandler
    {
        private readonly IDepotOrderRepository _repository = repository;
        private readonly ILogger<GetMissingOrderByIdQueryHandler> _logger = logger;
        private readonly DepotDbContext _context = context;

        /// <summary>
        /// Handler para devolver una orden faltante por su ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<DepotOrderMissingDto> GetMissingOrderByIdAsync(int id)
        {
            var orderExist = await _repository.GetMissingOrderByIdAsync(id);
            if (orderExist == null)
            {
                _logger.LogError($"Missing order with ID {id} not found.");
                throw new Exception($"Missing order with ID {id} not found.");
            }

            var orderMissingDto = new DepotOrderMissingDto
            {
                MissingId = orderExist.MissingId,
                DepotOrderId = orderExist.DepotOrderId,
                SalesOrderId = orderExist.SalesOrderId,
                MissingReason = orderExist.MissingReason,
                MissingDescription = orderExist.MissingDescription,
                MissingItems = orderExist.MissingItems,
                DescriptionResolution = orderExist.DescriptionResolution,
                MissingDate = orderExist.MissingDate,
                DepotOrder = orderExist.DepotOrder
            };

            _logger.LogInformation($"Missing order with ID {id} retrieved successfully.");

            return orderMissingDto;
        }
    }
}
