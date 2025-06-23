using DepotService.Application.Commands.DepotOperator.AddPackaing;
using DepotService.Application.DTOs.DepotOperator.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotOperator
{
    public class AddPackaingCommandValidator : AbstractValidator<AddPackagingCommand>
    {
        public AddPackaingCommandValidator()
        {
            RuleForEach(x => x.PackaingItems).ChildRules(item =>
            {
                item.RuleFor(i => i.DepotOrderItemId)
                    .NotEmpty().WithMessage("DepotOrderItemId is required.");
                item.RuleFor(i => i.PackaingType)
                    .NotEmpty().WithMessage("PackaingType is required.")
                    .MaximumLength(50).WithMessage("PackaingType must be at most 50 characters long.");
            });
        }
    }
}
