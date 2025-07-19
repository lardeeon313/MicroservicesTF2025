using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.Reports
{
    public class StatusAverageTimeDto
    {
        public string Status { get; set; } = string.Empty;
        public double AverageDuration { get; set; }
    }
}
