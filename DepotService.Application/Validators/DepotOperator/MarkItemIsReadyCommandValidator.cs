using DepotService.Application.Commands.DepotOperator.MarkItemReady;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotOperator
{
    public class MarkItemIsReadyCommandValidator : AbstractValidator<MarkItemCommand>
    {
        public MarkItemIsReadyCommandValidator()
        {
            RuleFor(x => x.OrderItemId)
                .NotEmpty()
                .WithMessage("El ID del artículo del pedido no puede estar vacío.");
            RuleFor(x => x.OperatorUserId)
                .NotEmpty()
                .WithMessage("El ID del usuario operador no puede estar vacío.");
        }
    }
}
