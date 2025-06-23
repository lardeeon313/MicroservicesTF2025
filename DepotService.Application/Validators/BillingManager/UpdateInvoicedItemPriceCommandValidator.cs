using DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.BillingManager
{
    public class UpdateInvoicedItemPriceCommandValidator : AbstractValidator<UpdateInvoicedItemPriceCommand>
    {
        public UpdateInvoicedItemPriceCommandValidator()
        {
            RuleFor(command => command.BillingOrderId)
                .NotEmpty().WithMessage("Invoiced Item ID is required.");

            RuleFor(command => command.NewUnitPrice)
                .GreaterThan(0).WithMessage("New unit price must be greater than zero.");

            RuleFor(command => command.ItemId)
                .NotEmpty().WithMessage("Item ID is required.")
                .GreaterThan(0).WithMessage("Item ID must be a positive integer.");
        }
    }
}
