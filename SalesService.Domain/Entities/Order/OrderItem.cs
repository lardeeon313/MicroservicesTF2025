using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.Order
{
    public class OrderItem
    {
        public Guid Id { get; set; }

        // Relación con Order
        public Guid OrderId { get; set; }
        public required Order Order { get; set; }

        // Propiedades del producto
        public required string ProductName { get; set; }
        public required string ProductBrand { get; set; }
        public int Quantity { get; set; }
        public string? Packaging { get; set; }
        public decimal UnitPrice { get; set; }

        // Total del ítem (calculado si querés en algún servicio)
        public decimal Total => Quantity * UnitPrice;
    }
}