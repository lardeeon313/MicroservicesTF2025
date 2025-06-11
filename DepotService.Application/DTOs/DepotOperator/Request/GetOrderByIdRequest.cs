using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotOperator.Request
{
    public class GetOrderByIdRequest
    {
        [Required]
        public int DepotOrderId { get; set; }
        [Required]
        public Guid OperatorUserId { get; set; }
    }
}
