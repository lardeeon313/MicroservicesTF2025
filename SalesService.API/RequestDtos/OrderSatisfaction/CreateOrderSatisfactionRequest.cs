namespace SalesService.API.RequestDtos.OrderSatisfaction
{
    public class CreateOrderSatisfactionRequest
    {
        public string Token { get; set; } = string.Empty;
        public int Score { get; set; }
        public string? Comment { get; set; }
    }
}
