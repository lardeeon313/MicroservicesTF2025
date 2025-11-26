using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Domain.IRepositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogisticService.Application.Services.IdentityServiceClient;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetRejectionReasonsByOrderId
{
    public class GetRejectionReasonsByOrderIdQueryHandler(ILogisticOrderRepository repository, ILogger<GetRejectionReasonsByOrderIdQueryHandler> logger, IIdentityServiceClient identityClient) : IGetRejectionReasonsByOrderIdQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;
        private readonly IIdentityServiceClient _identityClient = identityClient;
        private readonly ILogger<GetRejectionReasonsByOrderIdQueryHandler> _logger = logger;

        /// <summary>
        /// Query para devolver todos los rechazos de asignacion que tuvo una orden en especifica.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>        
        public async Task<IEnumerable<DeliveryRejectionReasonDto>> GetRejectionReasonsByOrderIdAsync(GetRejectionReasonsByOrderIdQuery query)
        {
            var rejectionReasons = await _repository.GetRejectionReasonsByOrderIdAsync(query.LogisticOrderId);
            if (rejectionReasons == null)
            {
                _logger.LogInformation("No rejection reasons found with order id {logisticOrderId}.", query.LogisticOrderId);
                return new List<DeliveryRejectionReasonDto>();
            }

            var operators = await _identityClient.GetUserWithRoleDeliveryOperator();

            return rejectionReasons.Select(rejectionReason =>
            {
                var op = operators.FirstOrDefault(o =>
                    o.Id == rejectionReason.DeliveryOperatorId.ToString());

                return new DeliveryRejectionReasonDto
                {
                    Id = rejectionReason.Id,
                    DeliveryOperatorId = rejectionReason.DeliveryOperatorId,
                    Reason = rejectionReason.Reason,
                    RejectedAt = rejectionReason.RejectedAt,

                    
                    DeliveryOperatorFullName = op?.FullName
                };
            }).ToList();
        }
    }
}
