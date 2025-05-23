using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Entities.Order;

namespace DepotService.Domain.Entities.MissingProduct
{
    public class MissingProduct
    {
        /// <summary>
        /// Relacion con el producto , de tal manera que indica de que producto se 
        /// produce el faltante 
        /// </summary>
        public int Id { get; set; }
        public required OrderItem OrderItem { get; set; }
    }
}
