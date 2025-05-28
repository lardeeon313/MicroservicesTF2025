using System;
using System.Collections.Generic;
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
        public string TeamName { get; set; } = string.Empty;
    }
}
