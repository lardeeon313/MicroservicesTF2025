using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Response
{
    public class UpdateTeamResponse
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string? TeamDescription { get; set; }
    }
}
