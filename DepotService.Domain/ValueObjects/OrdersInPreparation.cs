using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.ValueObjects
{
    public class OrdersInPreparation
    {
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? DeliveryDetail { get; set; }
        public DateTime InPreparationAt { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? DepotTeamName { get; set; }
    }
}
