using FluentValidation;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryZones;

namespace LogisticService.API.Validators.DeliveryZones
{
    public class UpdateDeliveryZoneRequestValidator : AbstractValidator<UpdateDeliveryZoneRequest>
    {
        public UpdateDeliveryZoneRequestValidator()
        {
            RuleFor(x => x.ZoneName)
                .NotEmpty().WithMessage("TeamName is required")
                .MaximumLength(50).WithMessage("ZoneName must be at most 50 characters");
            RuleFor(x => x.ZoneDescription)
                .MaximumLength(500).WithMessage("ZoneDescription must be at most 500 characters");
        }
    }
}
