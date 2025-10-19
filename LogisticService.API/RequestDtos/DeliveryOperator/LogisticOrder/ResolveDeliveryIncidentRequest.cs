using LogisticService.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.DeliveryOperator.LogisticOrder
{
    public class ResolveDeliveryIncidentRequest
    {
        [Required(ErrorMessage = "El ID del incidente es obligatorio.")]
        public int IncidentId { get; set; }
        [Required(ErrorMessage = "El ID del pedido logístico es obligatorio.")]
        public int LogisticOrderId { get; set; }
        [Required(ErrorMessage = "El estado de resolución es obligatorio.")]
        public DeliveryIncidentStatus ResolutionStatus { get; set; }
        [MaxLength(500, ErrorMessage = "Las notas de resolución no pueden exceder los 500 caracteres.")]
        public string ResolutionNotes { get; set; } = string.Empty;        
    }
}
