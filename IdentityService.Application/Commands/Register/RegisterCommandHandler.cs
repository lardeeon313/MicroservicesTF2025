using IdentityService.Application.Common;
using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;
using IdentityService.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Register
{
    public class RegisterCommandHandler(
        UserManager<ApplicationUser> userManager, 
        RoleManager<IdentityRole> roleManager) 
        : IRegisterCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;

        public async Task<CommandResult> Handle(RegisterCommand command)
        {
            var existingUser = await _userManager.FindByEmailAsync(command.Email);
            if (existingUser != null)
                return new CommandResult { Success = true , Message = "User it exists"};

            var user = new ApplicationUser
            {
                UserName = command.UserName,
                Name = command.Name,
                LastName = command.LastName,
                Email = command.Email,
                HightDate = DateTime.UtcNow,
                Employed_Status = EmployedStatus.Active
            };

            var result = await _userManager.CreateAsync(user, command.Password);
            if (!result.Succeeded)
            {
                var errorMessages = string.Join(" ", result.Errors.Select(e => e.Description));
                return new CommandResult { Success = false, Message = $"Error al crear el usuario: {errorMessages}" };
            }

            //Asigna un rol neutro por ahora...
            const string defaultRole = "Default";

            if (!await _roleManager.RoleExistsAsync(defaultRole))
                await _roleManager.CreateAsync(new IdentityRole(defaultRole));

            await _userManager.AddToRoleAsync(user, defaultRole);

            return new CommandResult { Success = true, Message = "Usuario registrado exitosamente con rol default." };

        }
    }
}
