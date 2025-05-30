using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Request
{
    /// <summary>
    /// Request para asignar una orden de depósito a un equipo.
    /// </summary>
    public class AssignOrderRequest
    {
        /// <summary>
        /// Identificador de la orden de depósito que se asignará al equipo.
        /// </summary>
        [Required(ErrorMessage = "DepotOrderId is required")]
        public int DepotOrderId { get; set; }
        /// <summary>
        /// Identificador del operador al que se asignará la orden de depósito.
        /// </summary>
        [Required(ErrorMessage = "OperatorUserId is required")]
        public Guid OperatorUserId { get; set; }

    }
}
