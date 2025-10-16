using SalesService.Domain.Enums;
using SharedKernel.IntegrationEvents.PaymentTypes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.DTOs.Customer
{
    public class UpdateCustomerRequest
    {
        public Guid Id { get; set; }

        [MaxLength(50)]
        [Display(Name = "FirstName")]
        public string? FirstName { get; set; } 

        [MaxLength(50)]
        [Display(Name = "LastName")]
        public string? LastName { get; set; } 

        [EmailAddress, RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format")]
        [Display(Name = "Email")]
        public string? Email { get; set; } 

        [MaxLength(50)]
        [Display(Name = "PhoneNumber")]
        public string? PhoneNumber { get; set; }

        public List<AddressRequest> Addresses { get; set; } = new();
        public List<PaymentType> PaymentTypes { get; set; } = new();
    }
}
