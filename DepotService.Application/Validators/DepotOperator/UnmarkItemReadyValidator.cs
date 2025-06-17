using DepotService.Application.Commands.DepotOperator.UnMarkItemReady;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotOperator
{
    public class UnmarkItemReadyValidator :AbstractValidator<UnmarkItemReadyCommand>
    {
        public UnmarkItemReadyValidator()
        {
            RuleFor(x => x.OrderItemId)
                .NotEmpty()
                .WithMessage("El ID del item del pedido no puede estar vacío.");
        }
    }
}
