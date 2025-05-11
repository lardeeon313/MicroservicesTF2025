using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetByIdCustomer
{
    /// <summary>
    /// Consulta para obtener un pedido por su ID de cliente.
    /// </summary>
    public class GetOrderByIdCustomerQuery
    {
        public Guid CustomerId { get; set; }

        public GetOrderByIdCustomerQuery(Guid customerId)
        {
            CustomerId = customerId;
        }
    }
}
