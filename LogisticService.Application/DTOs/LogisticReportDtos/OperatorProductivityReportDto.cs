using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class OperatorProductivityReportDto
    {
        public Guid OperatorId { get; set; }        
        public int TotalOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int RejectedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CanceledOrders { get; set; }
        public decimal? TotalCollectedAmount { get; set; }
    }
}
