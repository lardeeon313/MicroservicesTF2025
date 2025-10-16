using LogisticService.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.LogisticOrders
{
    public class SetPriorityRequest
    {
        [Required]
        public int LogisticOrderId { get; set; }
        [Required]
        public DeliveryPriority DeliveryPriority { get; set; }
    }
}
