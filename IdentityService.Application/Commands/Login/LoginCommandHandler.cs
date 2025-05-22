using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Services.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Login
{
    public class LoginCommandHandler(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService) : ILoginCommandHandler
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;

        public async Task<AuthResponse?> Handle(LoginCommand command)
        {
            var user = await _userManager.FindByEmailAsync(command.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, command.Password))
            {
                return null;
            }

            

            var token = await _tokenService.GenerateToken(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponse
            {
                Email = user.Email!,
                UserName = user.UserName!,
                Roles = roles,
                Token = token
            }; 


        }
    }
}
