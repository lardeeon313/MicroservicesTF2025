using LogisticService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.DTOs.LogisticOrderDtos
{
    public class LogisticOrderItemDto
    {
        public int Id { get; set; }        
        public string? ProductName { get; set; } 
        public string? ProductBrand { get; set; } 
        public int Quantity { get; set; } 
        public string? PackagingType { get; set; } 
        public decimal? UnitPrice { get; set; } 
        public decimal Total { get; set; }
    }
}
