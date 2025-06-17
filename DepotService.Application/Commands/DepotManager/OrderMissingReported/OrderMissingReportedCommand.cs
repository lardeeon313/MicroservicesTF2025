using DepotService.Application.DTOs;
using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotManager.OrderMissingReported
{
    /// <summary>
    /// Comando para reportar un pedido del Depósito como faltante
    /// </summary>
    public class OrderMissingReportedCommand
    {
        public int DepotOrderId { get; set; }
        public string MissingReason { get; set; } = string.Empty;
        public string MissingDescription { get; set; } = string.Empty;
        public List<DepotOrderItemsReportedDto> MissingItems { get; set; } = [];
        public OrderMissingReportedCommand(int depotOrderId,List<DepotOrderItemsReportedDto> missingItems, string missingReason, string missingDescription)
        {
            DepotOrderId = depotOrderId;
            MissingReason = missingReason;
            MissingDescription = missingDescription;
            MissingItems = missingItems;
        }
    }
}
