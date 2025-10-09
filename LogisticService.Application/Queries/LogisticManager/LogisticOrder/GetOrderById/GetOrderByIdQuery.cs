using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrderById
{
    public class GetOrderByIdQuery(int id)
    {
        public int Id { get; } = id;
    }
}
