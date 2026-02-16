using IdentityService.Application.DTOs;
using IdentityService.Application.Services.Interfaces;
using IdentityService.Domain.Common.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ForgotPassword
{
    public class ForgotPasswordCommandHandler(ITokenService tokenService, IEmailService emailService, UserManager<ApplicationUser> userManager) : IForgotPasswordCommandHandler
    {
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailService _emailService = emailService;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        /// <summary>
        /// Handler para el olvido de contraseña
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>        
        public async Task<ForgotPasswordResponse> HandleAsync(ForgotPasswordCommand command)
        {
            var user = await _userManager.FindByEmailAsync(command.Email);

            if (user == null)
                return new ForgotPasswordResponse { RequiresPasswordCreation = false };

            if (user.MustCreatePassword)
            {
                return new ForgotPasswordResponse
                {
                    RequiresPasswordCreation = true,
                    UserId = user.Id
                };
            }

            var token = await _tokenService.GenerateResetPasswordToken(user);

            await _emailService.SendResetPasswordEmail(user.Email!, token);

            return new ForgotPasswordResponse
            {
                RequiresPasswordCreation = false,
            };
        }
    }
}