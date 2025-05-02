using SalesService.Application.DTOs;

namespace SalesService.Application.Commands.Orders
{
    public class UpdateOrderCommand
    {
        public Guid OrderId { get; set; }
        public required List<ProductDto> Products { get; set; }
        public required string DeliveryDetail { get; set; }
    }
}
