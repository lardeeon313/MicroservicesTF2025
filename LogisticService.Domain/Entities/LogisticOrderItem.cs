using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Domain.Entities
{
    public class LogisticOrderItem
    {
        public int Id { get; set; }

        // Relación con Order
        public int OrderId { get; set; }
        public LogisticOrder? Order { get; set; }

        // Propiedades del producto
        public string? ProductName { get; set; } // Lo coloca SalesService
        public string? ProductBrand { get; set; } // Lo coloca SalesService
        public int Quantity { get; set; } // Lo coloca SalesService 
        public string? PackagingType { get; set; } // Lo coloca el Operador de Deposito a cargo de la orden
        public decimal? UnitPrice { get; set; } // Lo coloca el encargado de Facturacion en Deposito

        // Total calculado por DepotService (encargado de Facturacion)
        public decimal Total { get; set; }  

        // Trazabilidad con DepotService y SalesService
        public int SalesOrderItemId { get; set; }
        public int DepotOrderItemId { get; set; }
    }
}
