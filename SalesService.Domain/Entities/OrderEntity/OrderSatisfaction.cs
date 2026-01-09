using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class OrderSatisfaction
    {
        public int Id { get; private set; }
        public int OrderId { get; private set; }
        public Guid CustomerId { get; private set; }

        public int Score { get; private set; } // 1 a 10
        public string? Comment { get; private set; }

        public DateTime CreatedAt { get; private set; }

        protected OrderSatisfaction() { }

        public OrderSatisfaction(
            int orderId,
            Guid customerId,
            int score,
            string? comment)
        {
            if (score < 1 || score > 10)
                throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 1 and 10.");

            OrderId = orderId;
            CustomerId = customerId;
            Score = score;
            Comment = comment;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
