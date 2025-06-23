using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotOperator.Request
{
    public class AddPackagingRequest
    {
        [Required(ErrorMessage = "El ID del producto de la orden es obligatorio.")]
        public int DepotOrderItemId { get; set; }
        [Required(ErrorMessage = "El tipo de empaque es obligatorio.")]
        public string PackaingType { get; set; } = string.Empty;
    }
}
    