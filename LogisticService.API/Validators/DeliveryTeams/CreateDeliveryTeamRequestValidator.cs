using FluentValidation;
using LogisticService.API.RequestDtos.DeliveryTeams;

namespace LogisticService.API.Validators.DeliveryTeams
{
    public class CreateDeliveryTeamRequestValidator : AbstractValidator<CreateDeliveryTeamRequest>
    {
        public CreateDeliveryTeamRequestValidator()
        {
            RuleFor(x => x.TeamName)
                .NotEmpty().WithMessage("TeamName is required")
                .MaximumLength(100).WithMessage("TeamName must be at most 50 characteres");
            RuleFor(x => x.TeamDescription)
                .MaximumLength(500).WithMessage("TeamDescription must be at most 500 characters");
        }
    }
}
