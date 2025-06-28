using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.BillingManager
{
    public class GetInvoicedOrdersByDateRangeQueryValidator : AbstractValidator<GetInvoicedOrdersByDateRangeQuery>
    {
        public GetInvoicedOrdersByDateRangeQueryValidator()
        {
            RuleFor(query => query.StartDate)
                .NotEmpty().WithMessage("Start date is required.")
                .LessThanOrEqualTo(query => query.EndDate).WithMessage("Start date must be less than or equal to end date.");

            RuleFor(query => query.EndDate)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThanOrEqualTo(query => query.StartDate).WithMessage("End date must be greater than or equal to start date.");
        }
    }
}
