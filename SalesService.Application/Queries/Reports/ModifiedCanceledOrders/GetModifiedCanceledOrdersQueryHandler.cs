using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.ModifiedCanceledOrders
{
    public class GetModifiedCanceledOrdersQueryHandler(IReportRepository repository) : IGetModifiedCanceledOrdersQueryHandler
    {
        private readonly IReportRepository _repository = repository;

        /// <summary>
        /// Handler para 
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<PagedResult<ModifiedCanceledOrderDto>> HandleAsync(GetModifiedCanceledOrdersQuery query)
        {
            var orders = await _repository.GetModifiedOrCanceledAsync(
                query.CustomerName,
                query.DateFrom,
                query.DateTo,
                query.Status,
                query.Page,
                query.PageSize
            );

            return new PagedResult<ModifiedCanceledOrderDto>
            {
                Items = orders.Items.Select(r => new ModifiedCanceledOrderDto
                {
                    OrderId = r.OrderId,
                    CustomerFullName = r.CustomerFullName,
                    OrderDate = r.OrderDate,
                    ModifiedDate = r.ModifiedDate,
                    Status = r.Status,                    
                }).ToList(),

                TotalCount = orders.TotalCount,
                PageNumber = orders.PageNumber,
                PageSize = orders.PageSize
            };
        }
    }
}
