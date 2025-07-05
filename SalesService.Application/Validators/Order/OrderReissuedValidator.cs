using FluentValidation;
using SalesService.Application.Commands.Orders.OrderReissued;
using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Order
{
    public class OrderReissuedValidator : AbstractValidator<OrderReissuedRequest>
    {
        public OrderReissuedValidator()
        {
             RuleFor(x => x.SalesOrderId)
                .NotEmpty().WithMessage("El ID de la orden es obligatorio.")
                .GreaterThan(0).WithMessage("El ID de la orden debe ser mayor a 0.");
            RuleFor(x => x.UpdateItems)
                .NotEmpty().WithMessage("La lista de items actualizados es obligatoria.")
                .Must(items => items.Count > 0).WithMessage("Debe haber al menos un item actualizado.");
            RuleFor(x => x.DescriptionResolution)
                .NotEmpty().WithMessage("La descripción de la resolución es obligatoria.")
                .MaximumLength(500).WithMessage("La descripción de la resolución no puede exceder los 500 caracteres.");
        }
    }
}
