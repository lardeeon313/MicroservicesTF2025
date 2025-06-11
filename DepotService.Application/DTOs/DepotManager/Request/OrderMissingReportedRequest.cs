using DepotService.Domain.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotManager.Request
{
    public class OrderMissingReportedRequest
    {
        [Required]
        public int DepotOrderId { get; set; }

        [Required]
        public int SalesOrderId { get; set; }

        [Required, StringLength(500, ErrorMessage = "The reason must be at most 500 characters long.")]
        public string MissingReason { get; set; } = string.Empty;

        [Required, StringLength(1000, ErrorMessage = "The description must be at most 1000 characters long.")]
        public string MissingDescription { get; set; } = string.Empty;

        public List<DepotOrderItemsReportedDto> MissingItems { get; set; } = new List<DepotOrderItemsReportedDto>();
    }
}
