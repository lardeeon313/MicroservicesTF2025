using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class OrderItem
    {
        public int Id { get; set; }

        // Relación con Order
        public int OrderId { get; set; }
        public Order? Order { get; set; }

        // Propiedades del producto
        public required string ProductName { get; set; } // Lo coloca SalesService
        public required string ProductBrand { get; set; } // Lo coloca SalesService
        public int Quantity { get; set; } // Lo coloca SalesService 
        public string? PackagingType { get; set; } // Lo coloca el Operador de Deposito a cargo de la orden
        public decimal? UnitPrice { get; set; } // Lo coloca el encargado de Facturacion en Deposito

        // Total calculado por DepotService (encargado de Facturacion)
        public decimal? Total => (Quantity * UnitPrice ?? 0);
    }
}
