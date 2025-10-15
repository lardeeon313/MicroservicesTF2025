using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public  class LogisticPagedOrderDto
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public List<LogisticOrderDto> Orders { get; set; } = new();
    }
}
