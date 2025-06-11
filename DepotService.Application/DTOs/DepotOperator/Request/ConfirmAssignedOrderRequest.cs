using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotOperator.Request
{
    public class ConfirmAssignedOrderRequest
    {
        [Required(ErrorMessage = "El ID del pedido del depósito es obligatorio.")]
        public int DepotOrderId { get; set; }
        [Required(ErrorMessage = "El ID del usuario operador es obligatorio.")]
        public Guid OperatorUserId { get; set; }
    }
}
