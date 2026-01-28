using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetById
{
    /// <summary>
    /// Manejador de la consulta GetOrderByIdQuery.
    /// </summary>
    public class GetOrderByIdQueryHandler(IOrderRepository repository) : IGetOrderByIdQueryHandler
    {
        private readonly IOrderRepository _repository = repository;
        public async Task<OrderDto> Handle(GetOrderByIdQuery query)
        {
            var order = await _repository.GetByIdAsync(query.Id)
                ?? throw new KeyNotFoundException($"Order with id {query.Id} not found");

            return new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                CustomerFirstName = order.Customer?.FirstName,
                CustomerLastName = order.Customer?.LastName,
                DeliveryDetail = order.DeliveryDetail,
                DeliveryDate = order.DeliveryDate,
                PaymentType = order.PaymentType,
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
                Address = order.DeliveryAddress == null
                ? null
                : new AddressDto
                {
                    Id = order.DeliveryAddress.Id,
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
            };
        }
    }
}
