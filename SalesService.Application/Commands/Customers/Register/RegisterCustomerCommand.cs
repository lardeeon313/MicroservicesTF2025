using SalesService.Application.DTOs.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Register
{
    public class RegisterCustomerCommand
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public List<AddressDto> Addresses { get; }

        public RegisterCustomerCommand(string firstName, string lastName, string email, string phoneNumber, List<AddressDto> addresses)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            Addresses = addresses;
        }
    }
}
