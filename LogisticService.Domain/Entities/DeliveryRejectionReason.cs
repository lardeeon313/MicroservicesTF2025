using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class DeliveryRejectionReason
    {
        public int Id { get; set; }
        public int LogisticOrderId { get; set; }
        public LogisticOrder LogisticOrder { get; set; } = null!;
        public Guid DeliveryOperatorId { get; set; }

        [MaxLength(500)]
        [Required]
        public string Reason { get; set; } = string.Empty;
        public DateTime RejectedAt { get; set; } = DateTime.UtcNow;
    }
}
