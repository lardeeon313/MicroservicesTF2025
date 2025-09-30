using System.ComponentModel.DataAnnotations;

namespace LogisticService.API.RequestDtos.DeliveryTeams
{
    public class AssignZoneToTeamRequest
    {
        /// <summary>
        /// ID del equipo al que se asigna el operador.
        /// </summary>
        [Required(ErrorMessage = "DepotTeam is required")]
        public int TeamId { get; set; }

        /// <summary>
        /// ID de la zona
        /// </summary>
        [Required(ErrorMessage = "ZoneId is required")]
        public int ZoneId { get; set; }
    }
}
