using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Response;
using SalesService.Domain.Entities.OrderEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Orders.GetPagedOrders
{
    /// <summary>
    /// Handler que procesa la consulta paginada de órdenes.
    /// </summary>
    public class GetPagedOrdersQueryHandler(IOrderRepository repository) : IGetPagedOrdersQueryHandler
    {
        private readonly IOrderRepository _repository = repository;

        public async Task<PagedOrderResponse> Handle(GetPagedOrdersQuery query, CancellationToken cancellationToken)
        {
            var (orders, totalCount) = await _repository.GetPagedAsync(query.PageNumber, query.PageSize, cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize);

            return new PagedOrderResponse
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = query.PageNumber,
                Orders = orders.Select(o => new OrderDto
                {
                    Id = o.Id,
                    CustomerId = o.CustomerId,
                    CustomerFirstName = o.Customer?.FirstName,
                    CustomerLastName = o.Customer?.LastName,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    DeliveryDate = o.DeliveryDate,
                    DeliveryDetail = o.DeliveryDetail,
                    PaymentType = o.PaymentType,
                    ModifiedStatusDate = o.ModifiedStatusDate,
                    Address = new AddressDto
                    {
                        Street = o.DeliveryAddress.Street,
                        Number = o.DeliveryAddress.Number,
                        Apartment = o.DeliveryAddress.Apartment,
                        City = o.DeliveryAddress.City,
                        Province = o.DeliveryAddress.Province,
                        Country = o.DeliveryAddress.Country,
                        PostalCode = o.DeliveryAddress.PostalCode,
                        Latitude = o.DeliveryAddress.Latitude,
                        Longitude = o.DeliveryAddress.Longitude,
                        FormattedAddress = o.DeliveryAddress.FormattedAddress
                    }
                }).ToList(),

            };
            // Devolver tambien la fecha de creación - 
        }
    }
}
