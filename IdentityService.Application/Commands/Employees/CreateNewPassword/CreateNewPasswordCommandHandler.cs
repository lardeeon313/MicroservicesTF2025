using IdentityService.Application.Common;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.CreateNewPassword
{
    public class CreateNewPasswordCommandHandler(UserManager<ApplicationUser> userManager) : ICreateNewPasswordCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        /// <summary>
        /// Handler para que un usuario cree una nueva contraseña.
        /// cuando fue creado por un admin y todavía no tiene una.        
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<CommandResult> Handle(CreateNewPasswordCommand command)
        {
            // Buscar usuario
            var user = await _userManager.FindByIdAsync(command.UserIdentityId);
            if (user == null)
            {
                return new CommandResult
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            // Verificar que el usuario esté habilitado para crear su primera contraseña
            if (!user.MustCreatePassword)
            {
                return new CommandResult
                {
                    Success = false,
                    Message = "This user already has a password assigned."
                };
            }

            // Generar token de password reset
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Establecer nueva contraseña
            var result = await _userManager.ResetPasswordAsync(user, resetToken, command.NewPassword);

            if (!result.Succeeded)
            {
                return new CommandResult
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            // Desmarcar flag
            user.MustCreatePassword = false;

            await _userManager.UpdateAsync(user);

            return new CommandResult
            {
                Success = true,
                Message = "Password created successfully."
            };
        }
    }
}
