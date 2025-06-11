using DepotService.Application.DTOs.DepotManager.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotManager
{
    public class OrderMissingReportedCommandValidator : AbstractValidator<OrderMissingReportedRequest>
    {
        public OrderMissingReportedCommandValidator()
        {
            RuleFor(x => x.MissingReason)
                .NotEmpty().WithMessage("MissingReason is required")
                .MaximumLength(100).WithMessage("The reason must be at most 500 characters long.");
            RuleFor(x => x.MissingDescription)
                .NotEmpty().WithMessage("MissingDescription is required")
                .MaximumLength(500).WithMessage("The description must be at most 1000 characters long.");
            RuleFor(x => x.DepotOrderId)
                .NotEmpty().WithMessage("DepotOrderId is required.");
            RuleFor(x => x.SalesOrderId)
                .NotEmpty().WithMessage("SalesOrderId is required.");
            RuleFor(x => x.MissingItems)
                .NotEmpty().WithMessage("MissingItems is required.")
                .Must(items => items.Count > 0).WithMessage("At least one missing item must be reported.")
                .WithMessage("MissingItems cannot be empty.");
        }
    }
}
