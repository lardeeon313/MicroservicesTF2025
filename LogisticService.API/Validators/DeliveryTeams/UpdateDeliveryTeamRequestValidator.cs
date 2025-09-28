using FluentValidation;
using LogisticService.API.RequestDtos.DeliveryTeams;

namespace LogisticService.API.Validators.DeliveryTeams
{
    public class UpdateDeliveryTeamRequestValidator : AbstractValidator<UpdateDeliveryTeamRequest>
    {
        public UpdateDeliveryTeamRequestValidator()
        {
            RuleFor(x => x.TeamName)
                .NotEmpty().WithMessage("TeamName is required")
                .MaximumLength(50).WithMessage("TeamName must be at most 50 characters");
            RuleFor(x => x.TeamDescription)
                .MaximumLength(500).WithMessage("TeamDescription must be at most 500 characters");
        }
    }

}
