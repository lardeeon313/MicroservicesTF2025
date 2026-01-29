using SalesService.Application.DTOs.Customer;
using SalesService.Application.Queries.Customers.GetCustomerById;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Queries.Customers.GetCustomer
{
    public class GetCustomerByIdQueryHandler(ICustomerRepository repository) : IGetCustomerByIdQueryHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<CustomerResponse?> HandleAsync(GetCustomerByIdQuery query)
        {
            var customer = await _repository.GetByIdAsync(query.Id);

            if (customer is null) return null;

            return new CustomerResponse
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                RegistrationDate = customer.RegistrationDate,
                Status = customer.Status.ToString(),                
                Addresses = customer.Addresses.Select(a => new AddressDto
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
                    FormattedAddress = a.FormattedAddress,
                }).ToList(),
                PaymentTypes = customer.PaymentTypes
                    .Select(pt => pt.PaymentType) 
                    .ToList()
            };
        }
    }
}
