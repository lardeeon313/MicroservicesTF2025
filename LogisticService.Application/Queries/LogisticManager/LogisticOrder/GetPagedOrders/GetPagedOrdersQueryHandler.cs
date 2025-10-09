using LogisticService.Application.DTOs;
using LogisticService.Application.DTOs.DeliveryZoneDtos;
using LogisticService.Application.DTOs.LogisticOrderDtos;
using LogisticService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetPagedOrders
{
    /// <summary>
    /// Handler que procesa la consulta paginada de órdenes.
    /// </summary>
    public class GetPagedOrdersQueryHandler(ILogisticOrderRepository repository) : IGetPagedOrdersQueryHandler
    {
        private readonly ILogisticOrderRepository _repository = repository;

        public async Task<LogisticPagedOrderDto> Handle(GetPagedOrdersQuery query, CancellationToken cancellationToken)
        {
            var (orders, totalCount) = await _repository.GetPagedAsync(query.PageNumber, query.PageSize, cancellationToken);

            var totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize);

            return new LogisticPagedOrderDto
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = query.PageNumber,
                Orders = orders.Select(o => new LogisticOrderDto
                {
                    Id = o.Id,
                    Status = o.Status,
                    OrderDate = o.OrderDate,
                    DeliveryDate = o.DeliveryDate,
                    ModifiedStatusDate = o.ModifiedStatusDate,
                    TotalAmount = o.TotalAmount,
                    PaymentReceipt = o.PaymentReceipt,
                    DeliveryDetail = o.DeliveryDetail,
                    PaymentType = o.PaymentType,
                    Customer = o.Customer == null ? null : new()
                    {
                        Id = o.Customer.Id,
                        FirstName = o.Customer.FirstName,
                        LastName = o.Customer.LastName,
                        Email = o.Customer.Email,
                        PhoneNumber = o.Customer.PhoneNumber
                    },
                    Items = o.Items.Select(item => new LogisticOrderItemDto
                    {
                        Id = item.Id,
                        ProductName = item.ProductName,
                        ProductBrand = item.ProductBrand,
                        Quantity = item.Quantity,
                        Total = item.Total,
                        PackagingType = item.PackagingType,
                        UnitPrice = item.UnitPrice
                    }).ToList(),
                    AssignedOperatorId = o.AssignedOperatorId,
                    AssignedDeliveryZone = new DeliveryZoneDto
                    {
                        Name = o.AssignedDeliveryZone?.Name ?? string.Empty,
                        Description = o.AssignedDeliveryZone?.Description ?? string.Empty
                    },
                    AssignedDeliveryTeam = new DeliveryTeamDto
                    {
                        TeamName = o.AssignedDeliveryTeam?.TeamName ?? string.Empty,
                        TeamDescription = o.AssignedDeliveryTeam?.TeamDescription ?? string.Empty
                    },
                    DeliveryAddress = new LogisticAddressDto
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
        }
    }
}
