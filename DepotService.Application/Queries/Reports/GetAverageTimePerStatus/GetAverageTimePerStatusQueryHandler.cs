using DepotService.Application.DTOs.Reports;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Reports.GetAverageTimePerStatus
{
    public class GetAverageTimePerStatusQueryHandler(IDepotReportRepository repository, DepotDbContext context, ILogger<GetAverageTimePerStatusQueryHandler> logger) : IGetAverageTimePerStatusQueryHandler
    {
        private readonly ILogger<GetAverageTimePerStatusQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        private readonly IDepotReportRepository _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        private readonly DepotDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        public async Task<List<StatusAverageTimeDto>> GetAverageTimePerStatusAsync(GetAverageTimePerStatusQuery query)
        {
            var averages = await _repository.GetAverageTimePerStatusAsync(query.From, query.To);
            if (averages == null || !averages.Any())
            {
                _logger.LogWarning("No average times found for any status.");
                return new List<StatusAverageTimeDto>();
            }

            return averages.Select(avg => new StatusAverageTimeDto
            {
                Id = avg.Id,
                OrderId = avg.OrderId,
                Status = $"{avg.OldStatus} → {avg.NewStatus}",
                ChangedAt = avg.ChangedAt,
                AverageDuration = avg.AverageDuration
            }).ToList();

        }
    }
}
