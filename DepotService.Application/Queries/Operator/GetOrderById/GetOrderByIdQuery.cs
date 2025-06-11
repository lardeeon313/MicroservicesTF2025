using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Queries.Operator.GetOrderById
{
    /// <summary>
    /// query para obtener un pedido del Depósito por su ID asociado a un operador específico.
    /// </summary>
    public class GetOrderByIdQuery
    {
        public int DepotOrderId { get; set; }
        public Guid OperatorUserId { get; set; }

        public GetOrderByIdQuery(int depotOrderId, Guid operatorUserId)
        {
            DepotOrderId = depotOrderId;
            OperatorUserId = operatorUserId;
        }
    }
}
