using FluentValidation;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryZones;

namespace LogisticService.API.Validators.DeliveryZones
{
    public class CreateDeliveryZoneRequestValidator : AbstractValidator<CreateDeliveryZoneRequest>
    {
        public CreateDeliveryZoneRequestValidator()
        {
            RuleFor(x => x.ZoneName)
                .NotEmpty().WithMessage("ZoneName is required")
                .MaximumLength(100).WithMessage("ZoneName must be at most 50 characteres");
            RuleFor(x => x.ZoneDescription)
                .MaximumLength(500).WithMessage("ZoneDescription must be at most 500 characters");
        }
    }
}
