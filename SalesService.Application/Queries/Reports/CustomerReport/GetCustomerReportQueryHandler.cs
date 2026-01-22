using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerReport
{
    public class GetCustomerReportQueryHandler(IReportRepository repository) : IGetCustomerReportQueryHandler
    {
        private readonly IReportRepository _repository = repository;

        /// <summary>
        /// Handler para obtener el reporte de clientes con filtros y paginacion
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<PagedResult<CustomerReportDto>> HandleAsync(GetCustomerReportQuery query)
        {
            var results = await _repository.GetCustomerReportAsync(
                query.Name,
                query.Email,
                query.MinOrders,
                query.Page,
                query.PageSize
            );            

            return new PagedResult<CustomerReportDto>
            {
                Items = results.Items.Select(r => new CustomerReportDto
                {
                    CustomerId = r.CustomerId,
                    FullName = r.FullName,
                    Email = r.Email,
                    PhoneNumber = r.PhoneNumber,
                    OrderCount = r.OrderCount
                }).ToList(),
                TotalCount = results.TotalCount,
                PageNumber = results.PageNumber,
                PageSize = results.PageSize
            };
        }
    }
}
