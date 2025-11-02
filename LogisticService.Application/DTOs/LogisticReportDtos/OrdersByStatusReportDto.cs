using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticReportDtos
{
    public class OrdersByStatusReportDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
