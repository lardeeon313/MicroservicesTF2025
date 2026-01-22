using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Entities.OrderEntity
{
    public class OrderSatisfactionToken
    {
        public int Id { get; private set; }

        public int OrderId { get; private set; }
        public Order Order { get; private set; } = null!;

        public string Token { get; private set; } = string.Empty;

        public DateTime ExpiresAt { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime? UsedAt { get; private set; }

        public bool IsUsed => UsedAt.HasValue;

        protected OrderSatisfactionToken() { }

        public OrderSatisfactionToken(int orderId, TimeSpan validity)
        {
            OrderId = orderId;
            Token = Guid.NewGuid().ToString("N");
            ExpiresAt = DateTime.UtcNow.Add(validity);
        }

        public void MarkAsUsed()
        {
            if (IsUsed)
                throw new InvalidOperationException("Token already used.");

            UsedAt = DateTime.UtcNow;
        }

        public void Validate()
        {
            if (IsUsed)
                throw new InvalidOperationException("Token already used.");

            if (ExpiresAt < DateTime.UtcNow)
                throw new InvalidOperationException("Token expired.");
        }
    }
}
