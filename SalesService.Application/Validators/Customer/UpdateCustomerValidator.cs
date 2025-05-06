using FluentValidation;
using SalesService.Application.DTOs.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Customer
{
    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerRequest>
    {
        public UpdateCustomerValidator()
        {

            RuleFor(x => x.FirstName)
                .MaximumLength(50).WithMessage("First name must be at most 50 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.FirstName));


            RuleFor(x => x.LastName)
                .MaximumLength(50).WithMessage("Last name must be at most 50 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.LastName));

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("A valid email is required.")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^[0-9]{8,15}$").WithMessage("Phone must contain only numbers and be between 8 to 15 digits.")
                .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber));

        }
    }
}
