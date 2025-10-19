using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.DeliveryOperator.LogisticOrder
{
    public class RejectAssignOrderRequest
    {
        [Required]
        public int LogisticOrderId { get; set; }
        [Required]
        public Guid OperatorUserId { get; set; }
        [Required]
        public string Reason { get; set; } = string.Empty;
    }
}
