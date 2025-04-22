namespace SalesService.Infrastructure.Messaging
{
    public class OrderCreatedEvent
    {
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal TotalAmount { get; set; }

        public OrderCreatedEvent(Guid orderId, Guid customerId, decimal totalAmount)
        {
            OrderId = orderId;
            CustomerId = customerId;
            TotalAmount = totalAmount;
        }
    }
}
