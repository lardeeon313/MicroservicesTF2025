using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Request
{
    public class CreateTeamRequest
    {
        /// <summary>
        /// Nombre del equipo a crear.
        /// </summary>
        [Required(ErrorMessage = "TeamName is required.")]
        [MaxLength(100, ErrorMessage = "TeamName must be at most 50 characteres.")]
        public string TeamName { get; set; } = string.Empty;

        /// <summary>
        /// Descripción del equipo a crear.
        /// </summary>
        [MaxLength(500, ErrorMessage = "TeamDescription must be at most 500 characteres.")]
        public string? TeamDescription { get; set; } 
    }
}
