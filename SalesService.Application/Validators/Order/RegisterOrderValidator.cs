using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Order
{
    public class RegisterOrderValidator : AbstractValidator<DTOs.Order.Request.RegisterOrderRequest>
    {
        public RegisterOrderValidator()
        {
            RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("El cliente es obligatorio.");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Debe incluir al menos un producto.")
                .ForEach(x => x.SetValidator(new RegisterOrderItemValidator()));
            RuleFor(x => x.DeliveryDate)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("La fecha de entrega debe ser mayor a la fecha actual.")
                .When(x => x.DeliveryDate.HasValue);
            RuleFor(x => x.CreatedByUserId)
                .NotEmpty().WithMessage("El usuario creador es obligatorio.");
        }
    }
    
}
