using FluentValidation;
using IdentityService.Application.Commands.Login;
using IdentityService.Application.Commands.Register;
using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Queries.GetAllOperators;
using IdentityService.Application.Queries.GetAllSalesStaffs;
using IdentityService.Application.Queries.GetCurrentUser;
using IdentityService.Application.Services.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IdentityService.API.Controllers
{
    
    [ApiController]
    [Route("api/auth")]
    public class AuthController(
        ILoginCommandHandler loginCommandHandler,
        IRegisterCommandHandler registerCommandHandler,
        IGetAllOperatorsQueryHandler getAllOperatorsQueryHandler,
        IGetAllSalesStaffsQueryHandler getAllSalesStaffsQueryHandler,
        IGetCurrentUserQueryHandler getCurrentUserQueryHandler,
        IValidator<RegisterRequest> registerValidator,
        IValidator<LoginRequest> loginValidator) : Controller
    {
        private readonly IGetAllOperatorsQueryHandler _getAllOperatorsQueryHandler = getAllOperatorsQueryHandler;
        private readonly IValidator<LoginRequest> _loginValidator = loginValidator;
        private readonly IValidator<RegisterRequest> _registerValidator = registerValidator;
        private readonly IRegisterCommandHandler _registerCommandHandler = registerCommandHandler;
        private readonly ILoginCommandHandler _loginCommandHandler = loginCommandHandler;
        private readonly IGetAllSalesStaffsQueryHandler _getAllSalesStaffsQueryHandler = getAllSalesStaffsQueryHandler;
        private readonly IGetCurrentUserQueryHandler _getCurrentUserQueryHandler = getCurrentUserQueryHandler;

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
                Name = request.Name,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Role = request.Role
            };

            var result = await _registerCommandHandler.Handle(command);
            if (!result.Success)
                return BadRequest(new { error = result.Message});
            
            return Ok(new { message = result.Message});
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


        /// <summary>
        /// Devuelve todos los usuarios con rol "Operator"
        /// </summary>
        /// <returns>Lista de operadores</returns>
        /// <response code="200">Lista obtenida exitosamente</response>
        /// <response code="401">No autorizado</response>
        [HttpGet("operators")]
        [ProducesResponseType(typeof(List<OperatorDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllOperators()
        {
            var operators = await _getAllOperatorsQueryHandler.HandleAsync();
            return Ok(operators);
        }

        /// <summary>
        /// Devuelve todos los usuarios con rol "SalesStaff"
        /// </summary>
        /// <returns>Lista de Encargados de Ventas</returns>
        /// <response code="200">Lista obtenida exitosamente</response>
        /// <response code="401">No autorizado</response>
        [HttpGet("salesstaffs")]
        [ProducesResponseType(typeof(List<OperatorDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllSalesStaffs()
        {
            var SalesStaffs = await _getAllSalesStaffsQueryHandler.HandleAsync();
            return Ok(SalesStaffs);
        }

        /// <summary>
        /// Obtiene los datos del usuario autenticado actualmente.
        /// </summary>
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // Obtener el Id del usuario logueado desde los Claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("No se pudo determinar el usuario actual.");

            var query = new GetCurrentUserQuery { UserId = userId };
            var result = await _getCurrentUserQueryHandler.GetCurrentUserHandler(query);

            return Ok(result);
        }
    }
}
