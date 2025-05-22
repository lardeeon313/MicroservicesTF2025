using FluentValidation;
using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Order
{
    public class RegisterOrderItemValidator : AbstractValidator<RegisterOrderItemRequest>
    {
        public RegisterOrderItemValidator()
        {
            RuleFor(x => x.ProductName)
                .NotEmpty().WithMessage("El nombre del producto es obligatorio.")
                .MaximumLength(100);

            RuleFor(x => x.ProductBrand)
                .NotEmpty().WithMessage("La marca del producto es obligatoria.")
                .MaximumLength(100);

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("La cantidad debe ser mayor a 0.");
        }
    }
}
