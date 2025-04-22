using SalesService.Application.DTOs;

namespace SalesService.Application.Commands
{
    public class CreateOrderCommand
    {
        public required string CustomerFirstName { get; set; }
        public string? CustomerLastName { get; set; }
        public required string CustomerEmail { get; set; }
        public required string CustomerAddress { get; set; }
        public required List<ProductDto> Products { get; set; }
        public required string DeliveryDetail { get; set; }
    }
}
