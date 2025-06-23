using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Response;
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
                }).ToList()
            };
            // Devolver tambien la fecha de creación - 
        }
    }
}
