using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.LogisticOrders
{
    public class RemoveAssignOperatorRequest
    {
        /// <summary>
        /// Request para remover la asignación de una orden a un operario.
        /// </summary>
        [Required(ErrorMessage = "LogisticOrderId is required")]
        public int LogisticOrderId { get; set; }
        /// <summary>
        /// Identificador del operador al que se asignará la orden de depósito.
        /// </summary>
        [Required(ErrorMessage = "OperatorUserId is required")]
        public Guid OperatorUserId { get; set; }
    }
}
