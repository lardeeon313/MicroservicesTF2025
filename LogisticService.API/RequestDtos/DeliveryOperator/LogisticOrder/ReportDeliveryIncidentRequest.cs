using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.DeliveryOperator.LogisticOrder
{
    public class ReportDeliveryIncidentRequest
    {
        [Required(ErrorMessage = "El ID del pedido del depósito es obligatorio.")]
        public int LogisticOrderId { get; set; }
        [Required(ErrorMessage = "El ID del usuario operador es obligatorio.")]
        public Guid OperatorUserId { get; set; }
        [Required(ErrorMessage = "El tipo de incidente es obligatorio.")]
        public string IncidentType { get; set; } = string.Empty;
        [MaxLength(500, ErrorMessage = "La descripción del incidente no puede exceder los 500 caracteres.")]
        public string Description { get; set; } = string.Empty;
    }
}
