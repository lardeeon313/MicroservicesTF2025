using FluentValidation;
using SalesService.Application.DTOs.Order.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Validators.Order
{
    public class UpdateOrderStatusValidator : AbstractValidator<UpdateOrderStatusRequest>
    {
        public UpdateOrderStatusValidator()
        {
            RuleFor(x => x.OrderId)
                .GreaterThan(0).WithMessage("El ID de la orden es obligatorio.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("El estado de la orden es inválido.");
        }
    }
}
