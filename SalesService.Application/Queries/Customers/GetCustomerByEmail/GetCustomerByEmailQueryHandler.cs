using SalesService.Application.DTOs.Customer;
using SalesService.Domain.Entities;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomerByEmail
{
    public class GetCustomerByEmailQueryHandler(ICustomerRepository repository) : IGetCustomerByEmailQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;
        public async Task<CustomerResponse?> HandleAsync(GetCustomerByEmailQuery query)
        {
            var customer = await _repository.GetByEmailAsync(query.Email);

            if (customer is null)
                return null; 

            return new CustomerResponse
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Addresses = customer.Addresses.Select(a => new AddressDto
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
                    PaymentTypes = customer.PaymentTypes
                        .Select(pt => pt.PaymentType)
                        .ToList()
            };

        }
    }
}
