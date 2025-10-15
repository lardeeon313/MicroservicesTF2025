using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Application.DTOs.LogisticCustomerDtos;
using LogisticService.Domain.Entities;
using LogisticService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public class LogisticOrderDto
    {
        public int Id { get; set; }
        public OrderStatus Status { get; set; }
        public DeliveryPriority? DeliveryPriority { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public DateTime? ModifiedStatusDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentReceipt { get; set; }
        public string? DeliveryDetail { get; set; }
        public PaymentType? PaymentType { get; set; }
        public LogisticCustomerDto? Customer { get; set; }     
        public List<LogisticOrderItemDto> Items { get; set; } = [];        
        public Guid? AssignedOperatorId { get; set; }
        public DeliveryTeamDto AssignedDeliveryTeam { get; set; } = new();
        public DeliveryZoneDto AssignedDeliveryZone { get; set; } = new();
        public LogisticAddressDto? DeliveryAddress { get; set; }        
    }
}
