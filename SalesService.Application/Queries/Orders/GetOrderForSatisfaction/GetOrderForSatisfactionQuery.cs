using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetOrderForSatisfaction
{
    public class GetOrderForSatisfactionQuery
    {
        public string Token { get; set; } = string.Empty;

        public GetOrderForSatisfactionQuery(string token)
        {
            Token = token;
        }
    }
}
