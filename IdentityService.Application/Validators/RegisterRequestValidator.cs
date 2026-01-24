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
        private static readonly string[] ValidRoles =
        {
            "Admin",
            "SalesStaff",
            "BillingManager",
            "DepotManager",
            "DepotOperator",
            "DeliveryOperator",
            "VerificationManager"
        };

        public RegisterRequestValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                .MinimumLength(4).WithMessage("El nombre de usuario debe tener al menos 4 caracteres.")
                .MaximumLength(50).WithMessage("El nombre de usuario no puede superar los 50 caracteres.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MinimumLength(2).WithMessage("El nombre debe tener al menos 2 caracteres.")
                .MaximumLength(50).WithMessage("El nombre no puede superar los 50 caracteres.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("El apellido es obligatorio.")
                .MinimumLength(2).WithMessage("El apellido debe tener al menos 2 caracteres.")
                .MaximumLength(50).WithMessage("El apellido no puede superar los 50 caracteres.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El correo electrónico es obligatorio.")
                .EmailAddress().WithMessage("El formato del correo electrónico no es válido.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("El número de teléfono es obligatorio.")
                .Matches(@"^[0-9+() -]{6,20}$")
                .WithMessage("El número de teléfono no es válido.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es obligatoria.")
                .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.")
                .Matches("[A-Z]").WithMessage("La contraseña debe contener al menos una mayúscula.")
                .Matches("[a-z]").WithMessage("La contraseña debe contener al menos una minúscula.")
                .Matches("[0-9]").WithMessage("La contraseña debe contener al menos un número.")
                .Matches(@"[@!?.*$]").WithMessage("La contraseña debe contener al menos un carácter especial.");

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Seleccionar un rol es obligatorio.")
                .Must(role => ValidRoles.Contains(role))
                .WithMessage("El rol seleccionado no es válido.");
        }
    }
}
