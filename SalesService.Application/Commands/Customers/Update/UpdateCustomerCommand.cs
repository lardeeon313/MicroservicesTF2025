using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Customers.Update
{
    public class UpdateCustomerCommand
    {
        public UpdateCustomerCommand(Guid id, string? firstName, string? lastName, string? email, string? phoneNumber, string? address)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            Address = address;
        }

        public Guid Id { get; set; }
        public string? FirstName { get; set; } 
        public string? LastName { get; set; } 
        public string? Email { get; set; } 
        public string? PhoneNumber { get; set; } 
        public string? Address { get; set; }

    }
}
