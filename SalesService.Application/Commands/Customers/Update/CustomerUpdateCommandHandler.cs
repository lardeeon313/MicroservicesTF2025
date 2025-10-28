using SalesService.Domain.Entities;
using SalesService.Domain.Entities.CustomerEntity;
using SalesService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Update
{
    public class CustomerUpdateCommandHandler(ICustomerRepository repository) : ICustomerUpdateCommandHandler
    {
        private readonly ICustomerRepository _repository = repository;

        public async Task<bool> UpdateHandle(UpdateCustomerCommand command)
        {
            // Validamos si el ID del cliente existe
            var customer = await _repository.GetByIdAsync(command.Id);
            if (customer == null)
                throw new KeyNotFoundException($"Customer with ID {command.Id} not found.");
            
            if (command.FirstName is not null) customer.FirstName = command.FirstName;
            if (command.LastName is not null) customer.LastName = command.LastName;
            if (command.PhoneNumber is not null) customer.PhoneNumber = command.PhoneNumber;            
            if (command.Email is not null && command.Email != customer.Email)
            {
                // Validamos si el correo electrónico ya existe
                var existing = await _repository.GetByEmailAsync(command.Email);
                if (existing != null && existing.Id != command.Id)
                    throw new InvalidOperationException($"Email {command.Email} is already taken by another customer.");

                customer.Email = command.Email;
            }

            if (command.Addresses != null && command.Addresses.Any())
            {
                var existingAddresses = customer.Addresses.ToList();

                foreach (var ea in existingAddresses)
                {
                    bool isReferenced = await _repository.IsAddressReferencedInOrdersAsync(ea.Id);

                    // Verificamos si existe una dirección equivalente en el comando
                    bool existsEquivalent = command.Addresses.Any(a =>
                        (a.Id == ea.Id) ||
                        (
                            a.Street.Equals(ea.Street, StringComparison.OrdinalIgnoreCase) &&
                            a.Number.Equals(ea.Number, StringComparison.OrdinalIgnoreCase) &&
                            a.City.Equals(ea.City, StringComparison.OrdinalIgnoreCase) &&
                            a.Province.Equals(ea.Province, StringComparison.OrdinalIgnoreCase) &&
                            a.Country.Equals(ea.Country, StringComparison.OrdinalIgnoreCase)
                        )
                    );

                    if (!existsEquivalent && !isReferenced)
                    {
                        await _repository.RemoveAddress(ea);
                    }
                }

                // 🔄 Actualizar o agregar
                foreach (var dto in command.Addresses)
                {
                    var existing = existingAddresses.FirstOrDefault(a => a.Id == dto.Id);
                    if (existing != null)
                    {
                        // Actualizar dirección existente
                        existing.Street = dto.Street;
                        existing.Number = dto.Number;
                        existing.Apartment = dto.Apartment;
                        existing.City = dto.City;
                        existing.Province = dto.Province;
                        existing.Country = dto.Country;
                        existing.PostalCode = dto.PostalCode;
                        existing.Latitude = dto.Latitude;
                        existing.Longitude = dto.Longitude;
                        existing.FormattedAddress = dto.FormattedAddress;
                    }
                    else
                    {
                        // Verificamos si ya existe una dirección con los mismos datos
                        var duplicate = existingAddresses.FirstOrDefault(a =>
                            a.Street.Equals(dto.Street, StringComparison.OrdinalIgnoreCase) &&
                            a.Number.Equals(dto.Number, StringComparison.OrdinalIgnoreCase) &&
                            a.City.Equals(dto.City, StringComparison.OrdinalIgnoreCase) &&
                            a.Province.Equals(dto.Province, StringComparison.OrdinalIgnoreCase) &&
                            a.Country.Equals(dto.Country, StringComparison.OrdinalIgnoreCase));

                        if (duplicate == null)
                        {
                            // No existe → la agregamos
                            customer.Addresses.Add(new Address
                            {
                                Street = dto.Street,
                                Number = dto.Number,
                                Apartment = dto.Apartment,
                                City = dto.City,
                                Province = dto.Province,
                                Country = dto.Country,
                                PostalCode = dto.PostalCode,
                                Latitude = dto.Latitude,
                                Longitude = dto.Longitude,
                                FormattedAddress = dto.FormattedAddress,
                                CustomerId = customer.Id
                            });
                        }
                    }
                }
            }

            if (command.PaymentTypes != null && command.PaymentTypes.Any())
            {
                // Eliminamos los tipos anteriores
                customer.PaymentTypes.Clear();

                // Creamos los nuevos
                foreach (var pt in command.PaymentTypes)
                {
                    customer.PaymentTypes.Add(new CustomerPaymentType
                    {
                        CustomerId = customer.Id,
                        PaymentType = pt
                    });
                }
            }

            await _repository.UpdateAsync(customer);
            return true;
        }
    }
}
