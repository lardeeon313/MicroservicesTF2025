using DepotService.Application.DTOs;
using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.ReportOrderMissing
{
    /// <summary>
    /// Commando para reportar un pedido del Depósito como faltante
    /// </summary>
    public class ReportOrderMissingCommand 
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorUserId { get; set; }
        public string? MissingReason { get; set; }
        public string? MissingDescription { get; set; }
        public List<DepotOrderItemsReportedDto> MissingItems { get; set; } = [];
    }
}
