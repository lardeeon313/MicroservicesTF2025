using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Domain.Entities;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Validators.DepotManager
{
    public class UpdateTeamCommandValidator : AbstractValidator<UpdateTeamRequest>
    {
        public UpdateTeamCommandValidator()
        {
            RuleFor(x => x.TeamId)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.TeamName)
                .NotEmpty().WithMessage("TeamName is required")
                .MaximumLength(50).WithMessage("TeamName must be at most 100 characters");
            RuleFor(x => x.TeamDescription)
                .MaximumLength(500).WithMessage("TeamDescription must be at most 500 characters");
        }
    }
}
