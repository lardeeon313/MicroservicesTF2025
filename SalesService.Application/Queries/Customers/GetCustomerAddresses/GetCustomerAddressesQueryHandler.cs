using SalesService.Application.DTOs.Customer;
using SalesService.Domain.IRepositories;
using SalesService.Infraestructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerAddresses
{
    public class GetCustomerAddressesQueryHandler(ICustomerRepository repository) : IGetCustomerAddressesQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;
        public async Task<List<AddressDto>> HandleAsync(GetCustomerAddressesQuery query)
        {
            var customer = await _repository.GetByIdWithAddressesAsync(query.CustomerId);

            if (customer == null)
                throw new KeyNotFoundException($"Customer {query.CustomerId} not found");

            return customer.Addresses
                .Select(a => new AddressDto
                {
                    Id = a.Id,
                    Street = a.Street,
                    Number = a.Number,
                    Apartment = a.Apartment,
                    City = a.City,
                    Province = a.Province,
                    Country = a.Country,
                    PostalCode = a.PostalCode,
                    Latitude = a.Latitude,
                    Longitude = a.Longitude,
                    FormattedAddress = a.FormattedAddress
                }).ToList();
        }
    }
}
