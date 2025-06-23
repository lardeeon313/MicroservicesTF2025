using DepotService.Domain.Entities;
using SharedKernel.IntegrationEvents.DepotEvents.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedKernel.IntegrationEvents.DepotEvents
{
    public class OrderMissingReportedIntegrationEvent
    {
        public int MissingId { get; set; }
        public int SalesOrderId { get; set; }
        public string MissingReason { get; set; } = string.Empty;
        public string MissingDescription { get; set; } = string.Empty;
        public List<MissingItemDto> MissingItems { get; set; } = [];
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
    }
}
