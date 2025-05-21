using DepotService.Application.Commands.DepotManager.AssignOrder;
using FluentValidation;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotManager
{
    public class AssignOrderCommandValidator : AbstractValidator<AssignOrderCommand>
    {
        public AssignOrderCommandValidator()
        {
            RuleFor(x => x.DepotOrderId).NotEmpty().WithMessage("La orden de depósito es obligatoria.");
            RuleFor(x => x.OperatorId).NotEmpty().WithMessage("El operador es obligatorio.");
            RuleFor(x => x.OperatorName)
                .NotEmpty().WithMessage("El nombre del operador es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");
        }
    }
}
