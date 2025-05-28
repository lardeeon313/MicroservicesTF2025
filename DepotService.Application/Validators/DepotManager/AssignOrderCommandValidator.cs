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
            RuleFor(x => x.OperatorUserId).NotEmpty().WithMessage("El operador es obligatorio.");
        }
    }
}
