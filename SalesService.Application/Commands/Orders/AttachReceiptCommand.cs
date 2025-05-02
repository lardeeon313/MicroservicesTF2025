namespace SalesService.Application.Commands.Orders
{
    public class AttachReceiptCommand
    {
        public Guid OrderId { get; set; }
        public string? Base64File { get; set; }
    }
}