using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public class LogisticOrderStatusHistoryDto
    {
        public int Id { get; set; }        
        public OrderStatus OldStatus { get; set; }
        public OrderStatus NewStatus { get; set; }
        public DateTime ChangedAt { get; set; }
        public double AverageDuration { get; set; } = 0; // Tiempo promedio de procesamiento del pedido en segundos        
    }
}
