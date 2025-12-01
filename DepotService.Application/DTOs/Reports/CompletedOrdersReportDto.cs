using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class CompletedOrdersReportDto
    {
        public int DepotOrderId { get; set; }
        public string CustomerName { get; set; } = null!;

        public Guid? OperatorId { get; set; }
        public string? OperatorFullName { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime PreparedAt { get; set; }
        public DateTime? DeliveryDate { get; set; }
    }

}
