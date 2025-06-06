using FluentValidation;
using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.UserName).
                NotEmpty().WithMessage("Username is required").
                MinimumLength(4).WithMessage("Username must be at least 4 characters long");

            RuleFor(x => x.Name).
                NotEmpty().WithMessage("Name is required").
                MinimumLength(4).WithMessage("Name must be at least 4 characters long");

            RuleFor(x => x.LastName).
                NotEmpty().WithMessage("Lastname is required").
                MinimumLength(4).WithMessage("Lastname must be at least 4 characters long");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is not valid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one digit")
                .Matches(@"[\@\!\?\*\.\$]").WithMessage("Password must contain a special character");

            // Validamos que el rol seleccionado sea correcto.
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("El rol es obligatorio.")
                .Must(role => new[]
                {
                "DepotManager", "DepotOperator", "BillingManager", "Admin",
                "Delivery", "SalesStaff", "VerificationStaff"
                }.Contains(role))
                .WithMessage("El rol seleccionado no es válido.");
        }
    }
}
