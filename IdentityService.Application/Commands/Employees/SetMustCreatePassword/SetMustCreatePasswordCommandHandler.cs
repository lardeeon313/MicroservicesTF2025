using IdentityService.Application.Common;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.SetMustCreatePassword
{
    public class SetMustCreatePasswordCommandHandler(UserManager<ApplicationUser> userManager) : ISetMustCreatePasswordCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        /// <summary>
        /// Handler para modificar la flag MustCreatePassword de un usuario.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<CommandResult> Handle(SetMustCreatePasswordCommand command)
        {
            var user = await _userManager.FindByIdAsync(command.UserIdentityId);
            if (user == null)
                return new CommandResult { Success = false, Message = "User not found." };

            user.MustCreatePassword = true;

            await _userManager.UpdateAsync(user);

            return new CommandResult { Success = true, Message = "Flag updated: user must create a new password." };
        }
    }
}
