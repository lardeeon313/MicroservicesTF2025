using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Orders.CreateOrderSatisfaction
{
    public class CreateOrderSatisfactionCommand
    {
        public string Token { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; }

        public CreateOrderSatisfactionCommand(string token, int score, string? comment)
        {
            Token = token;
            Score = score;
            Comment = comment;
        }
    }
}
