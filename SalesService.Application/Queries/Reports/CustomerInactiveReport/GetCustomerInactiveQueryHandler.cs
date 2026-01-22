using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerInactiveReport
{
    public class GetCustomerInactiveQueryHandler(IReportRepository repository) : IGetCustomerInactiveQueryHandler
    {
        private readonly IReportRepository _repository = repository;

        /// <summary>
        /// Handler para obtener el reporte de clientes inactivos con filtros y paginacion
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<PagedResult<CustomerStatusReportDto>> HandleAsync(GetCustomerInactiveQuery query)
        {
            var result = await _repository.GetCustomerStatusReportAsync(
                query.Name,
                query.Email,
                query.Status,
                query.Page,
                query.PageSize);

            return new PagedResult<CustomerStatusReportDto>
            {
                Items = result.Items.Select(r => new CustomerStatusReportDto
                {
                    CustomerId = r.CustomerId,
                    FullName = r.FullName,
                    Email = r.Email,
                    PhoneNumber = r.PhoneNumber,
                    OrderCount = r.OrderCount,
                    Status = r.Status.ToString()
                }).ToList(),

                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };
        }
    }
}
