using SalesService.Application.DTOs.Reports;
using SalesService.Domain.Helper;
using SalesService.Domain.IRepositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Reports.CustomerSatisfactionReport
{
    public class GetCustomerSatisfactionQueryHandler : IGetCustomerSatisfactionQueryHandler
    {
        private readonly IReportRepository _repository;

        public GetCustomerSatisfactionQueryHandler(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResult<CustomerSatisfactionReportDto>> HandleAsync(GetCustomerSatisfactionQuery query)
        {
            // 🔹 Parseo seguro string → enum
            SatisfactionLevel? parsedLevel = null;

            if (!string.IsNullOrWhiteSpace(query.Level))
            {
                if (Enum.TryParse<SatisfactionLevel>(query.Level, ignoreCase: true, out var level))
                {
                    parsedLevel = level;
                }
                else
                {
                    throw new ArgumentException($"El valor '{query.Level}' no es un nivel de satisfacción válido. Valores permitidos: Mala, Regular, Media, Alta.");
                }
            }


            var result = await _repository.GetCustomerSatisfactionReportAsync(
                query.Name,
                query.Email,
                parsedLevel,   // ✅ ACÁ ESTÁ LA CLAVE
                query.Page,
                query.PageSize
            );

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
