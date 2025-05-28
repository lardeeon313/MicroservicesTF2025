using SalesService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Order.Request
{
    public class UpdateOrderStatusRequest
    {
        [Required]
        public int OrderId { get; set; }
        [Required]
        public OrderStatus Status { get; set; }
        public string? ModifiedByUserId { get; set; }

    }
}
