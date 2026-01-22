using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogisticService.Application.Services.IdentityServiceClient;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetDeliveryIncidentByOrderId
{
    public class GetDeliveryIncidentByOrderIdQueryHandler(ILogisticOrderRepository repository, ILogger<GetDeliveryIncidentByOrderIdQueryHandler> logger, IIdentityServiceClient identityClient) : IGetDeliveryIncidentByOrderIdQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly ILogger<GetDeliveryIncidentByOrderIdQueryHandler> _logger = logger;
        private readonly IIdentityServiceClient _identityClient = identityClient;

        /// <summary>
        /// Query para devolver los incidentes de reparto de una Orden en especifico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<IEnumerable<DeliveryIncidentDto>> GetDeliveryIncidentByOrderIdAsync(GetDeliveryIncidentByOrderIdQuery query)
        {
            var deliveryIncidents = await _repository.GetDeliveryIncidentByOrderIdAsync(query.LogisticOrderId);

            var operators = await _identityClient.GetUserWithRoleDeliveryOperator();

            if (deliveryIncidents == null)
            {
                _logger.LogInformation("No delivery incidents found with order id {logisticOrderId}.", query.LogisticOrderId);
                return new List<DeliveryIncidentDto>();
            }

            return deliveryIncidents.Select(deliveryIncident =>
            {
                var operatorFound = operators
                    .FirstOrDefault(o => o.Id == deliveryIncident.ReportedByOperatorId.ToString());

                return new DeliveryIncidentDto
                {
                    Id = deliveryIncident.Id,
                    LogisticOrderId = deliveryIncident.LogisticOrderId,
                    ReportedByOperatorId = deliveryIncident.ReportedByOperatorId,
                    IncidentType = deliveryIncident.IncidentType,
                    Description = deliveryIncident.Description,
                    ReportedAt = deliveryIncident.ReportedAt,
                    Resolved = deliveryIncident.Resolved,
                    ResolvedAt = deliveryIncident.ResolvedAt,
                    ResolutionNote = deliveryIncident.ResolutionNote,
                    DeliveryIncidentStatus = deliveryIncident.DeliveryIncidentStatus,

                    
                    ReportedByOperatorFullName = operatorFound?.FullName
                };
            })
            .ToList();
        }
    }
}
