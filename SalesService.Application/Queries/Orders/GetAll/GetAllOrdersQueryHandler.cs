using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetAll
{
    /// <summary>
    /// Manejador para traer todas las Order
    /// </summary>
    /// <param name="repository"></param>
    public class GetAllOrdersQueryHandler(IOrderRepository repository) : IGetAllOrdersQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        public async Task<IEnumerable<OrderDto>> Handle( )
        {
            var orders = await _repository.GetAllAsync();

            if (!orders.Any())
                throw new KeyNotFoundException("No orders found");

            return orders.Select(order => new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                CustomerFirstName = order.Customer.FirstName,
                CustomerLastName = order.Customer.LastName,
                PaymentType = order.PaymentType,
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
