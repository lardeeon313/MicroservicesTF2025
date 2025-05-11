using SalesService.Application.DTOs.Order;
using SalesService.Domain.Enums;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetByStatus
{
    public class GetOrderByStatusQueryHandler(IOrderRepository repository) : IGetOrderByStatusQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        public async Task<IEnumerable<OrderDto>> HandleAsync(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                throw new ArgumentException($"Invalid order status: {status}");

            var orders = await _repository.GetByStatusAsync(parsedStatus.ToString());

            if (!orders.Any())
                throw new KeyNotFoundException($"No orders found with status {status}");

            return orders.Select(order => new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                DeliveryDetail = order.DeliveryDetail,
                DeliveryDate = order.DeliveryDate,
                ModifiedStatusDate = order.ModifiedStatusDate,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Items = order.Items.Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    ProductBrand = item.ProductBrand,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity
                }).ToList()
            });
        }
    }
}
