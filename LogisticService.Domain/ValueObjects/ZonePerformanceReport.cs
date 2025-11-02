using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.ValueObjects
{
    public class ZonePerformanceReport
    {
        public int DeliveryZoneId { get; set; }
        public string DeliveryZoneName { get; set; } = string.Empty;

        public int TotalOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int IncidentsCount { get; set; }
        public int RejectionsCount { get; set; }

        public double AverageDeliveryTimeHours { get; set; } // Promedio de horas entre OrderDate y DeliveryDate
        public double IncidentRatePercent { get; set; }      // % Incidencias / Total
        public double RejectionRatePercent { get; set; }     // % Rechazos / Total
        public double DeliverySuccessRatePercent { get; set; } // % entregadas sin problema

        public string? TopTeamName { get; set; } // Equipo más activo o eficiente
        public int? TopTeamId { get; set; }
    }
}
