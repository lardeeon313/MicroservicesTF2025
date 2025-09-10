using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.BillingManager
{
    public class GetInvoicedOrdersByCustomerQueryValidator
    : AbstractValidator<GetInvoicedOrdersByCustomerQuery>
    {
        public GetInvoicedOrdersByCustomerQueryValidator()
        {
            RuleFor(query => query.CustomerName)
                .NotEmpty()
                .WithMessage("Customer name is required.")
                .MinimumLength(2)
                .WithMessage("Customer name must be at least 2 characters long.");
        }
    }
}
