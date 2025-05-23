using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Enums.OrderStatus;

namespace DepotService.Domain.Entities.BillingManager
{
    public class BillingManager
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string Password { get;set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public DateTime HighDate { get; set; } = DateTime.Now;
        //recibe el pedido con estado preparado: 
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Prepared;
        public DateTime ValityDate { get;set; } = DateTime.Now; 

    }
}
