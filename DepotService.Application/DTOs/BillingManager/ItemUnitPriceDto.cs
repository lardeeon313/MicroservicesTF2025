using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.DTOs.BillingManager
{
    public class ItemUnitPriceDto
    {
        public int ItemId { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
