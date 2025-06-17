using DepotService.Domain.Entities;
using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs
{
    public class DepotOrderDto
    {
        public int DepotOrderId { get; set; }
        public int SalesOrderId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? DeliveryDetail { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }

        // Relacion con Items
        public ICollection<DepotOrderItemEntity> Items { get; set; } = [];

        // Relacion con Faltantes
        public ICollection<DepotOrderMissing> Missings { get; set; } = [];
        public Guid? AssignedOperatorId { get; private set; }
        public DepotTeamEntity? AssignedDepotTeam { get; set; }
        public int? AssignedDepotTeamId { get; private set; }
    }
}
