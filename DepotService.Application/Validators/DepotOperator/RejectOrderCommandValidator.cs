using DepotService.Application.Commands.DepotOperator.RejectOrder;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotOperator
{
    public class RejectOrderCommandValidator : AbstractValidator<RejectOrderCommand>
    {
        public RejectOrderCommandValidator()
        {
            RuleFor(x => x.DepotOrderId)
                .NotEmpty()
                .WithMessage("El ID del pedido del depósito no puede estar vacío.");
            RuleFor(x => x.OperatorUserId)
                .NotEmpty()
                .WithMessage("El ID del usuario operador no puede estar vacío.");
            RuleFor(x => x.RejectionReason)
                .MaximumLength(500)
                .WithMessage("La razón de rechazo no puede exceder los 500 caracteres.");
        }
    }
}
