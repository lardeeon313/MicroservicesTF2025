using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetByIdCustomer
{
    /// <summary>
    /// Manejador de la consulta GetOrderByIdCustomerQuery
    /// </summary>
    public class GetOrderByIdCustomerQueryHandler(IOrderRepository repository) : IGetOrderByIdCustomerQueryHandler
    {
        private IOrderRepository _repository = repository;
        public async Task<IEnumerable<OrderDto>> HandleAsync(GetOrderByIdCustomerQuery query)
        {
            var orders = await _repository.GetByCustomerIdAsync(query.CustomerId);

            if (!orders.Any())
                throw new KeyNotFoundException($"No orders found for customer with id {query.CustomerId}");

            return orders.Select(order => new OrderDto 
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                DeliveryDetail = order.DeliveryDetail,
                DeliveryDate = order.DeliveryDate,
                ModifiedStatusDate = order.ModifiedStatusDate,
                PaymentType = order.PaymentType,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Items = order.Items.Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    ProductBrand = item.ProductBrand,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity
                }).ToList(),
                Address = new AddressDto
                {
                    Street = order.DeliveryAddress.Street,
                    Number = order.DeliveryAddress.Number,
                    Apartment = order.DeliveryAddress.Apartment,
                    City = order.DeliveryAddress.City,
                    Province = order.DeliveryAddress.Province,
                    Country = order.DeliveryAddress.Country,
                    PostalCode = order.DeliveryAddress.PostalCode,
                    Latitude = order.DeliveryAddress.Latitude,
                    Longitude = order.DeliveryAddress.Longitude,
                    FormattedAddress = order.DeliveryAddress.FormattedAddress
                }
            });
        }
    }
}
