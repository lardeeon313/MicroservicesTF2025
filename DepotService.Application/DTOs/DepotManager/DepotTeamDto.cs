using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager
{
    public class DepotTeamDto
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OperatorInTeamDto> Operators { get; set; } = new();

    }
}
