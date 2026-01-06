using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using SalesService.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerPaymenTypeReport
{
    public class GetCustomerPaymentTypeQueryHandler(IReportRepository repository) : IGetCustomerPaymentTypeQueryHandler
    {
        private readonly IReportRepository _repository = repository;

        /// <summary>
        /// Handler para obtener el reporte de tipos de pago por cliente
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<PagedResult<CustomerPaymentTypeReportDto>> GetCustomerPaymentTypeReportAsync(GetCustomerPaymentTypeQuery query)
        {
            var result = await _repository.GetCustomerPaymentTypeReportAsync(
                query.Name,
                query.PaymentTypes,
                query.From,
                query.To,
                query.Page,
                query.PageSize);

            return new PagedResult<CustomerPaymentTypeReportDto>
            {
                Items = result.Items.Select(r => new CustomerPaymentTypeReportDto
                {
                    CustomerId = r.CustomerId,
                    Customer = r.FullName,
                    Address = r.Address,
                    PaymentTypes = r.PaymentTypes
                        .Select(pt => pt.ToString())
                        .Distinct()
                        .ToList()
                }),
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };
        }
    }
}
