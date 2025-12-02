using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class DeliveryTimeReportDto
    {
        public int? OrderId { get; set; }
        public int? DeliveryZoneId { get; set; }
        public string? DeliveryZoneName { get; set; }

        public int? TeamId { get; set; }
        public string? TeamName { get; set; }

        public Guid? OperatorId { get; set; }
        public string FullNameDeliveringOperator { get; set; } = string.Empty;

        // Cantidad por agrupación
        public int TotalDeliveredOrders { get; set; }

        // fechas
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }

        // Estado entregado a tiempo
        public bool DeliveredOnTime { get; set; }

        // Retraso en horas (positivo = tarde, negativo = adelantado) --> OPCIONAL (formatear en Front) 
        public double? DelayInHours { get; set; }
    }
}