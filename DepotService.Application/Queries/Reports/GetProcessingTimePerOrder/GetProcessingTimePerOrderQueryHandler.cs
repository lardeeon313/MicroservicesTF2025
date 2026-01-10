using DepotService.Application.DTOs.DepotOperator;
using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System.Security.Principal;

namespace DepotService.Application.Queries.Reports.GetProcessingTimePerOrder
{
    public class GetProcessingTimePerOrderQueryHandler(IDepotReportRepository repository, ILogger<GetProcessingTimePerOrderQueryHandler> logger, IIdentityServiceClient identityServiceClient) : IGetProcessingTimePerOrderQueryHandler
    {        
        private readonly IIdentityServiceClient _identityServiceClient = identityServiceClient;
        private readonly IDepotReportRepository _repository = repository;
        private readonly ILogger<GetProcessingTimePerOrderQueryHandler> _logger = logger;

        public async Task<PaginatedResult<OrderProcessingTimeDto>> HandleAsync(GetProcessingTimePerOrderQuery query)
        {
            // 1️⃣ Resolver operador por nombre
            string? operatorIdFilter = null;

            if (!string.IsNullOrWhiteSpace(query.Operator))
            {
                var allOperators = await _identityServiceClient.GetUserWithRoleOperator()
                    ?? new List<DepotOperatorsDto>();

                var matchedOperator = allOperators.FirstOrDefault(o =>
                    $"{o.FirstName} {o.LastName}"
                        .Contains(query.Operator, StringComparison.OrdinalIgnoreCase));

                if (matchedOperator != null)
                    operatorIdFilter = matchedOperator.Id;
            }

            // 2️⃣ Llamar repositorio
            var result = await _repository.GetAverageProcessingTimePerOrderAsync(
                query.From,
                query.To,
                operatorIdFilter,
                query.Customer,
                query.Page,
                query.PageSize
            );

            if (result == null || !result.Items.Any())
            {
                return new PaginatedResult<OrderProcessingTimeDto>
                {
                    Items = new(),
                    TotalItems = 0,
                    TotalPages = 0,
                    CurrentPage = query.Page
                };
            }

            // 3️⃣ Diccionario operadores
            var operatorIds = result.Items
                .Where(x => x.OperatorId.HasValue)
                .Select(x => x.OperatorId!.Value.ToString().ToLowerInvariant())
                .Distinct()
                .ToList();

            var allOps = await _identityServiceClient.GetUserWithRoleOperator()
                ?? new List<DepotOperatorsDto>();

            var operatorsById = allOps
                .Where(o => operatorIds.Contains(o.Id.ToLowerInvariant()))
                .ToDictionary(o => o.Id.ToLowerInvariant());

            // 4️⃣ Mapping final
            var mapped = result.Items.Select(x =>
            {
                string? operatorName = null;

                if (x.OperatorId.HasValue)
                {
                    var key = x.OperatorId.Value.ToString().ToLowerInvariant();
                    if (operatorsById.TryGetValue(key, out var op))
                        operatorName = $"{op.FirstName} {op.LastName}";
                }

                return new OrderProcessingTimeDto
                {
                    OrderId = x.OrderId,
                    CustomerName = x.CustomerName,
                    OperatorId = x.OperatorId,
                    OperatorFullName = operatorName,
                    StartPreparation = x.StartPreparation,
                    Prepared = x.Prepared,
                    DurationMinutes = x.DurationMinutes
                };
            }).ToList();

            return new PaginatedResult<OrderProcessingTimeDto>
            {
                Items = mapped,
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                CurrentPage = result.CurrentPage
            };
        }

    }
}
