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

        public async Task<string> Handle(RegisterCommand command)
        {
            var existingUser = await _userManager.FindByEmailAsync(command.Email);
            if (existingUser != null)
                return "User already exists.";

            var user = new ApplicationUser
            {
                UserName = command.UserName,
                Email = command.Email,
                HightDate = DateTime.UtcNow,
                Employed_Status = EmployedStatus.Active
            };

            var result = await _userManager.CreateAsync(user, command.Password);
            if (!result.Succeeded)
                return string.Join(" ", result.Errors.Select(e => e.Description));

            //Asigna un rol neutro por ahora...
            const string defaultRole = "Default";

            if (!await _roleManager.RoleExistsAsync(defaultRole))
                await _roleManager.CreateAsync(new IdentityRole(defaultRole));

            await _userManager.AddToRoleAsync(user, defaultRole);

            return "User registered with default role.";

        }
    }
}
