using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerSatisfactionReport
{
    public class GetCustomerSatisfactionQueryHandler(IReportRepository repository) : IGetCustomerSatisfactionQueryHandler
    {
        private readonly IReportRepository _repository = repository;

        /// <summary>
        /// Handler para obtener el reporte de satisfaccion del cliente
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<PagedResult<CustomerSatisfactionReportDto>> HandleAsync(GetCustomerSatisfactionQuery query)
        {
            var result = await _repository.GetCustomerSatisfactionReportAsync(
                query.Name,
                query.Email,
                query.Level,
                query.Page,
                query.PageSize);

            return new PagedResult<CustomerSatisfactionReportDto>
            {
                Items = result.Items.Select(r => new CustomerSatisfactionReportDto
                {
                    OrderId = r.OrderId,
                    Customer = r.FullName,
                    Email = r.Email,
                    Score = r.Score,
                    Level = r.Level.ToString(),
                    Date = r.CreatedAt
                }).ToList(),

                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

        }
    }
}
