
namespace SalesService.Application.Commands
{
    public class AttachReceiptCommand
    {
        public Guid OrderId { get; set; }
        public string? Base64File { get; set; }
    }
}