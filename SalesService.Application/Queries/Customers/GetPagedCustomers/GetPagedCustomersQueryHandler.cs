using SalesService.Application.DTOs.Customer;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetPagedCustomers
{
    public class GetPagedCustomersQueryHandler(ICustomerRepository repository) : IGetPagedCustomersQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<PagedCustomerResponse> HandleAsync(GetPagedCustomersQuery query, CancellationToken cancellationToken)
        {
            var (customers, totalCount) = await _repository.GetPagedAsync(query.PageNumber, query.PageSize, cancellationToken);
            var totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize);

            return new PagedCustomerResponse
            {
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / query.PageSize),
                CurrentPage = query.PageNumber,
                Customers = customers.Select(c => new CustomerResponse
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber,
                    Addresses = c.Addresses.Select(a => new AddressDto
                    {
                        Street = a.Street,
                        Number = a.Number,
                        Apartment = a.Apartment,
                        City = a.City,
                        Province = a.Province,
                        Country = a.Country,
                        PostalCode = a.PostalCode,
                        Latitude = a.Latitude,
                        Longitude = a.Longitude,
                        FormattedAddress = a.FormattedAddress,
                    }).ToList(),
                    PaymentTypes = c.PaymentTypes
                        .Select(pt => pt.PaymentType) 
                        .ToList(),
                    Status = c.Status.ToString()
                }).ToList()
            };
        }
    }
}
