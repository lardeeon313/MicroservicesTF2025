using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.VerificationManager.DeliveryTeams
{
    public class RemoveOperatorToTeamRequest
    {
        /// <summary>
        /// ID del equipo al que se asigna el operador.
        /// </summary>
        [Required(ErrorMessage = "DeliveryTeam is required")]
        public int TeamId { get; set; }

        /// <summary>
        /// ID del operador.
        /// </summary>
        [Required(ErrorMessage = "OperatorUserId is required")]
        public Guid OperatorUserId { get; set; }

    }
}
