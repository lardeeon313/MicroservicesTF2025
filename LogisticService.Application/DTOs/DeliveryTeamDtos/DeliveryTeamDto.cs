using LogisticService.Application.DTOs.DeliveryZoneDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs
{
    public class DeliveryTeamDto
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DeliveryOperatorsInTeamDto> Operators { get; set; } = [];
        public List<DeliveryZoneDto> ZoneAssignments { get; set; } = [];
    }
}
