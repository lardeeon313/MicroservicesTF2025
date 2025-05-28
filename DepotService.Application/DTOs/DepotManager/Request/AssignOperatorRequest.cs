using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Request
{
    public class AssignOperatorRequest
    {
        /// <summary>
        /// ID del equipo al que se asigna el operador.
        /// </summary>
        public int TeamId { get; set; }

        /// <summary>
        /// ID del operador.
        /// </summary>
        public Guid OperatorUserId { get; set; }

    }
}
