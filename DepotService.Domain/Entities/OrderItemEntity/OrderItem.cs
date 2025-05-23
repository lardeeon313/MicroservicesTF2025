using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.Order;

namespace DepotService.Domain.Entities.Order
{
    public class OrderItem
    {
        public int Id { get; set; }

        // Relación con Order
        public int OrderId { get; set; }
        public Order? order { get; set; }

        // Propiedades del producto
        public required string ProductName { get; set; } // Lo coloca SalesService
        public required string ProductBrand { get; set; } // Lo coloca SalesService
        public int Quantity { get; set; } // Lo coloca SalesService 
        public string? Packaging { get; set; } // Lo coloca el encargado de Deposito
        public decimal? UnitPrice { get; set; } // Lo coloca el encargado de Facturacion en Deposito

        // Total calculado por DepotService (encargado de Facturacion)
        public decimal? Total => (Quantity * UnitPrice ?? 0);
    }
}
