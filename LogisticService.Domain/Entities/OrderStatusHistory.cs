using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }
        //ELIMINAR  el ? 
        public int? OrderId { get; set; }
        public OrderStatus OldStatus { get; set; }
        public OrderStatus NewStatus { get; set; }
        public DateTime ChangedAt { get; set; }
        public double AverageDuration { get; set; } = 0; // Tiempo promedio de procesamiento del pedido en segundos
        public LogisticOrder LogisticOrder { get; set; } = null!; // Relación con la entidad Pedido
    }
}
