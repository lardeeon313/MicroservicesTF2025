using DepotService.Application.Commands.DepotManager.AssignOperator;
using DepotService.Application.DTOs.DepotManager.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotManager
{
    public class AssignOperatorCommandValidator : AbstractValidator<AssignOperatorRequest>
    {
        public AssignOperatorCommandValidator()
        {
            RuleFor(x => x.TeamId)
                .NotEmpty().WithMessage("TeamId is required");

            RuleFor(x => x.OperatorUserId)
                .NotEmpty().WithMessage("OperatorId is required");


        }
    }
}
