using LogisticService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public class DeliveryRejectionReasonDto
    {
        public int Id { get; set; } 
        public Guid DeliveryOperatorId { get; set; }

        [MaxLength(500)]
        [Required]
        public string Reason { get; set; } = string.Empty;
        public DateTime RejectedAt { get; set; } = DateTime.UtcNow;
    }
}
