using IdentityService.Application.Common;
using IdentityService.Domain.Entities;
using IdentityService.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ChangeEmployedStatus
{
    public class ChangeEmployedStatusCommandHandler(UserManager<ApplicationUser> userManager) : IChangeEmployedStatusCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        public async Task<CommandResult> Handle(ChangeEmployedStatusCommand command)
        {
            var user = await _userManager.FindByIdAsync(command.UserIdentityId);
            if (user == null)
                return new CommandResult { Success = false, Message = "User not found." };

            user.Employed_Status = command.NewStatus;

            if (command.NewStatus == EmployedStatus.Active)
                user.MustCreatePassword = true;

            await _userManager.UpdateAsync(user);

            return new CommandResult { Success = true, Message = "Employee status updated successfully." };
        }
    }
}
