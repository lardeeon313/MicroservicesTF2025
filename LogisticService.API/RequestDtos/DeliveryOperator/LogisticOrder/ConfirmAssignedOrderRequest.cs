using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.DeliveryOperator.LogisticOrder
{
    public class ConfirmAssignedOrderRequest
    {
        [Required(ErrorMessage = "El ID del pedido del depósito es obligatorio.")]
        public int LogisticOrderId { get; set; }
        [Required(ErrorMessage = "El ID del usuario operador es obligatorio.")]
        public Guid OperatorUserId { get; set; }
    }
}
