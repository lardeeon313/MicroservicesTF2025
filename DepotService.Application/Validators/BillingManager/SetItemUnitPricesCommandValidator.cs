using DepotService.Application.Commands.BillingManager.SetItemUnitPrices;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.BillingManager
{
    public class SetItemUnitPricesCommandValidator : AbstractValidator<SetItemUnitPricesCommand>
    {
        public SetItemUnitPricesCommandValidator()
        {
            RuleFor(x => x.DepotOrderId).GreaterThan(0);
            RuleForEach(x => x.ItemUnitPrices).ChildRules(item =>
            {
                item.RuleFor(i => i.ItemId).GreaterThan(0);
                item.RuleFor(i => i.UnitPrice).GreaterThan(0);
            });
        }
    }
}
