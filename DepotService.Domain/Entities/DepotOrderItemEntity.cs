using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Domain.Entities
{
    public class DepotOrderItemEntity
    {
        public int Id { get; set; }
        // Relación con DepotOrderEntity
        public int DepotOrderEntityId { get; set; }
        public DepotOrderEntity DepotOrderEntity { get; set; } = null!;

        // Relación con SalesOrderItemEntity
        public int SalesOrderItemId { get; set; }

        // Propiedades del producto
        public string ProductName { get; set; } = null!;
        public string ProductBrand { get; set; } = null!;
        public string? PackagingType { get; set; }
        public decimal? UnitPrice { get; set; }
        public int Quantity { get; set; }
        public bool IsReady { get; set; } = false; // Indica si el item está listo para ser entregado
        public decimal? Total => (Quantity * UnitPrice ?? 0);

        // Si es item reportado como missing
        public int? DepotOrderMissingId { get; set; }
        public DepotOrderMissing? DepotOrderMissing { get; set; }
    }
}
