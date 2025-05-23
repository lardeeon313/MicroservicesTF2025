using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.Order;
using DepotService.Domain.Enums.OrderStatus;

namespace DepotService.Domain.Entities.DepotManager
{
    public class DepotManager
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string Password { get; set; } = string.Empty;
        public DateTime HighDate { get; set; } = DateTime.Now;
        public required string Emial { get; set; } = string.Empty;

        //relacion con el estado actual del pedido que es emitido: 
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Issued;
        public DateTime ValidityDate { get; set; } = DateTime.Now;
    }
}
