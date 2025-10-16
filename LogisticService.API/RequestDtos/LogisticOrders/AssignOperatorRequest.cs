using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.LogisticOrders
{
    public class AssignOperatorRequest
    {
        /// <summary>
        /// Identificador de la orden de depósito que se asignará al equipo.
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
