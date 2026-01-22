using DepotService.Application.DTOs.DepotOperator;
using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Application.Services.IdentityServiceClient;
using DepotService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetOrdersCompleted
{
    public class GetOrdersCompletedQueryHandler(IDepotReportRepository repository, IIdentityServiceClient identityServiceClient) : IGetOrdersCompletedQueryHandler
    {
        private readonly IIdentityServiceClient _identity = identityServiceClient ?? throw new ArgumentNullException(nameof(identityServiceClient));
        private readonly IDepotReportRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        public async Task<PaginatedResult<CompletedOrdersReportDto>> HandleAsync(GetOrdersCompletedQuery query)
        {
            var result = await _repository.GetCompletedOrdersAsync(
            query.From, query.To, query.Page, query.PageSize);

            if (!result.Items.Any())
                return new PaginatedResult<CompletedOrdersReportDto>
                {
                    Items = new(),
                    TotalItems = 0,
                    TotalPages = 0,
                    CurrentPage = query.Page
                };

            // 1. Operator IDs
            var operatorIds = result.Items
                .Where(x => x.OperatorId != null)
                .Select(x => x.OperatorId!.Value.ToString().ToLowerInvariant())
                .Distinct()
                .ToList();

            // 2. Obtener operadores desde Identity
            var allOps = await _identity.GetUserWithRoleOperator() ?? new List<DepotOperatorsDto>();

            var opsById = allOps
                .Where(o => operatorIds.Contains(o.Id.ToLowerInvariant()))
                .ToDictionary(o => o.Id.ToLowerInvariant());

            // 3. Map
            var mapped = result.Items.Select(o =>
            {
                string? fullName = null;
                if (o.OperatorId != null)
                {
                    var id = o.OperatorId.Value.ToString().ToLowerInvariant();
                    if (opsById.TryGetValue(id, out var op))
                        fullName = $"{op.FirstName} {op.LastName}";
                }

                return new CompletedOrdersReportDto
                {
                    DepotOrderId = o.DepotOrderId,
                    CustomerName = o.CustomerName,
                    OperatorId = o.OperatorId,
                    OperatorFullName = fullName,
                    OrderDate = o.OrderDate,
                    PreparedAt = o.PreparedAt,
                    DeliveryDate = o.DeliveryDate
                };
            }).ToList();

            return new PaginatedResult<CompletedOrdersReportDto>
            {
                Items = mapped,
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                CurrentPage = result.CurrentPage
            };
        }
    }
}
