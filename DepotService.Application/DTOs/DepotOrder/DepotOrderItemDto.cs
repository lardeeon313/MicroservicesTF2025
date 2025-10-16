using DepotService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.DepotOrder
{
    public class DepotOrderItemDto
    {
        public int Id { get; set; }
        public string? ProductName { get; set; } = null!;
        public string? ProductBrand { get; set; } = null!;
        public string? Packaging { get; set; }
        public decimal? UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal? Total { get; set; }

        //Se lo tuvo que agregar para que quede marcado el color verde en el background:
        public bool IsReady { get; set; }
    }
}
