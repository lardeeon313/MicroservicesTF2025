using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.BillingManager
{
    public class GetInvoicedOrdersByCustomerQueryValidator : AbstractValidator<GetInvoicedOrdersByCustomerQuery>
    {
        public GetInvoicedOrdersByCustomerQueryValidator()
        {
            RuleFor(query => query.CustomerId)
                .NotEmpty().WithMessage("Customer ID is required.")
                .Must(id => id != Guid.Empty).WithMessage("Customer ID must be a valid GUID.");
        }
    }
}
