using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.DTOs.DepotManager.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotManager
{
    public class CreateTeamCommandValidator : AbstractValidator<CreateTeamRequest>
    {
        public CreateTeamCommandValidator()
        {
            RuleFor(x => x.TeamName)
                .NotEmpty().WithMessage("TeamName is required")
                .MaximumLength(100).WithMessage("TeamName must be at most 50 characteres");
            RuleFor(x => x.TeamDescription)
                .MaximumLength(500).WithMessage("TeamDescription must be at most 500 characters");

        }
    }
}
