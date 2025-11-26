using IdentityService.Application.Common;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ResetPassword
{
    public class ResetPasswordCommandHandler(UserManager<ApplicationUser> userManager) : IResetPasswordCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        /// <summary>
        /// Handler para resetear la contraseña de un empleado.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<CommandResult> Handle(ResetPasswordCommand command)
        {
            var user = await _userManager.FindByEmailAsync(command.Email);
            if (user == null)
            {
                return new CommandResult { Success = false, Message = "User not found." };
            }

            var result = await _userManager.ResetPasswordAsync(user, command.Token, command.NewPassword);

            if (!result.Succeeded)
            {
                return new CommandResult
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            // Si era usuario nuevo  ya no necesita crear password
            user.MustCreatePassword = false;
            await _userManager.UpdateAsync(user);

            return new CommandResult
            {
                Success = true,
                Message = "Password reset successfully."
            };
        }
    }
}
