using FluentValidation;
using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Order
{
    public class UpdateOrderValidator : AbstractValidator<UpdateOrderRequest>
    {
        public UpdateOrderValidator()
        {
            RuleFor(x => x.OrderId)
                .GreaterThan(0).WithMessage("El ID de la orden es obligatorio.");

            // Validar cada item solo si viene con datos
            RuleForEach(x => x.Items)
                .Where(item => item != null && (
                    !string.IsNullOrWhiteSpace(item.ProductName) ||
                    !string.IsNullOrWhiteSpace(item.ProductBrand)
                    ))
                .ChildRules(item =>
                {
                    item.RuleFor(i => i.ProductName)
                        .NotEmpty().WithMessage("El nombre del producto es obligatorio si se modifica el ítem.");

                    item.RuleFor(i => i.ProductBrand)
                        .NotEmpty().WithMessage("La marca del producto es obligatoria si se modifica el ítem.");
                });
        }
    }
}
