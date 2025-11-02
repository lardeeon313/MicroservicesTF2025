using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class DeliveryTimeReportDto
    {
        public int? DeliveryZoneId { get; set; }
        public string? DeliveryZoneName { get; set; }
        public Guid? OperatorId { get; set; }        
        public int TotalDeliveredOrders { get; set; }
        public double AverageDeliveryTimeInHours { get; set; } // tiempo promedio en horas
        public double MaxDeliveryTimeInHours { get; set; }
        public double MinDeliveryTimeInHours { get; set; }
    }
}
