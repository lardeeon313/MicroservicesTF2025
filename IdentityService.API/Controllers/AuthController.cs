using FluentValidation;
using IdentityService.Application.Commands.Login;
using IdentityService.Application.Commands.Register;
using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Services.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.API.Controllers
{
    
    [ApiController]
    [Route("api/auth")]
    public class AuthController(
        ILoginCommandHandler loginCommandHandler,
        IRegisterCommandHandler registerCommandHandler,
        IValidator<RegisterRequest> registerValidator,
        IValidator<LoginRequest> loginValidator) : Controller
    {
        private readonly IValidator<LoginRequest> _loginValidator = loginValidator;
        private readonly IValidator<RegisterRequest> _registerValidator = registerValidator;
        private readonly IRegisterCommandHandler _registerCommandHandler = registerCommandHandler;
        private readonly ILoginCommandHandler _loginCommandHandler = loginCommandHandler;


        /// <summary>
        /// Registra un nuevo usuario en el sistema 
        /// </summary>
        /// <param name="request">Datos del nuevo usuario</param>
        /// <returns>200 OK si se registra correctamente, 400 si falla</returns>
        [HttpPost("register")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new RegisterCommand
            {
                UserName = request.UserName,
                Email = request.Email,
                Password = request.Password

            };

            var result = await _registerCommandHandler.Handle(command);
            if (result.Contains("succesfully"))
                return Ok(result);
            
            return BadRequest(result);
        }

        /// <summary>
        /// Inicia sesión y devuelve un token JWT.
        /// </summary>
        /// <param name="request">Credenciales del usuario</param>
        /// <returns>Token y datos del usuario si son válidos</returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new LoginCommand
            {
                Email = request.Email,
                Password = request.Password
            };
 
            var response = await _loginCommandHandler.Handle(command);
            if (response == null)
                return Unauthorized("Invalid credentials.");

            return Ok(response);

        }
    }
}
