using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotOrder
{
    public class DepotOrderMissingDto
    {
        public int MissingId { get; set; }
        public int SalesOrderId { get; set; }
        public string? MissingReason { get; set; }
        public string? MissingDescription { get; set; }
        public string? DescriptionResolution { get; set; }
        public DateTime MissingDate { get; set; }
        public int DepotOrderId { get; set; }
        public List<DepotOrderMissingItemDto> MissingItems { get; set; } = new List<DepotOrderMissingItemDto>();
        public DepotOrderDto DepotOrder { get; set; } = null!;

    }
}
