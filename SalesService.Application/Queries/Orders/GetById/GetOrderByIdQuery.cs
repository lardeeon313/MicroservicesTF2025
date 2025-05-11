using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetById
{
    /// <summary>
    /// Consulta para obtener un pedido por su ID.
    /// </summary>

    public class GetOrderByIdQuery(int id)
    {
        public int Id { get; } = id;
    }
}
