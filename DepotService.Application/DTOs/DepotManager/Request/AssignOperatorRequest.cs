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
        /// <summary>ID del operador asignado</summary>
        [Required]
        public Guid OperatorId { get; set; }

        /// <summary>Nombre completo del operador</summary>
        [Required]
        [StringLength(100)]
        public string OperatorName { get; set; } = string.Empty;
    }
}
