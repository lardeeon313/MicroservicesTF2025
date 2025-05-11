using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.Cancel
{
    /// <summary>
    /// Comando para cancelar un pedido     
    /// </summary>
    public class CancelOrderCommand
    {
        public int Id { get; set; }
        public string Reason { get; set; }  

        public CancelOrderCommand(int id, string reason)
        {
            Id = id;
            Reason = reason;
        }
    }
    
}
