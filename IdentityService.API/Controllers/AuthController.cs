using FluentValidation;
using IdentityService.API.RequestsDtos;
using IdentityService.Application.Commands.Employees.ChangeEmployedStatus;
using IdentityService.Application.Commands.Employees.CreateNewPassword;
using IdentityService.Application.Commands.Employees.ForgotPassword;
using IdentityService.Application.Commands.Employees.ResetPassword;
using IdentityService.Application.Commands.Employees.SetMustCreatePassword;
using IdentityService.Application.Commands.Login;
using IdentityService.Application.Commands.Register;
using IdentityService.Application.Common;
using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Queries.GetAllDeliverys;
using IdentityService.Application.Queries.GetAllOperators;
using IdentityService.Application.Queries.GetAllSalesStaffs;
using IdentityService.Application.Queries.GetCurrentUser;
using IdentityService.Application.Services.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ResetPasswordRequest = IdentityService.API.RequestsDtos.ResetPasswordRequest;

namespace IdentityService.API.Controllers
{
    
    [ApiController]
    [Route("api/auth")]
    public class AuthController(
        ILoginCommandHandler loginCommandHandler,
        IRegisterCommandHandler registerCommandHandler,
        IChangeEmployedStatusCommandHandler changeEmployedStatusCommandHandler,
        ISetMustCreatePasswordCommandHandler setMustCreatePasswordCommandHandler,
        ICreateNewPasswordCommandHandler createNewPasswordCommandHandler,
        IForgotPasswordCommandHandler forgotPasswordCommandHandler,
        IResetPasswordCommandHandler resetPasswordCommandHandler,
        IGetAllOperatorsQueryHandler getAllOperatorsQueryHandler,
        IGetAllSalesStaffsQueryHandler getAllSalesStaffsQueryHandler,
        IGetCurrentUserQueryHandler getCurrentUserQueryHandler,
        IGetAllDeliverysQueryHandler getAllDeliverysQueryHandler,
        IValidator<Application.DTOs.RegisterRequest> registerValidator,
        IValidator<Application.DTOs.LoginRequest> loginValidator) : Controller
    {
        private readonly IGetAllDeliverysQueryHandler _getAllDeliverysQueryHandler = getAllDeliverysQueryHandler;
        private readonly IGetAllOperatorsQueryHandler _getAllOperatorsQueryHandler = getAllOperatorsQueryHandler;
        private readonly IValidator<Application.DTOs.LoginRequest> _loginValidator = loginValidator;
        private readonly IValidator<Application.DTOs.RegisterRequest> _registerValidator = registerValidator;
        private readonly IRegisterCommandHandler _registerCommandHandler = registerCommandHandler;
        private readonly ILoginCommandHandler _loginCommandHandler = loginCommandHandler;
        private readonly IChangeEmployedStatusCommandHandler _changeEmployedStatusCommandHandler = changeEmployedStatusCommandHandler;
        private readonly ISetMustCreatePasswordCommandHandler _setMustCreatePasswordCommandHandler = setMustCreatePasswordCommandHandler;
        private readonly ICreateNewPasswordCommandHandler _createNewPasswordCommandHandler = createNewPasswordCommandHandler;
        private readonly IForgotPasswordCommandHandler _forgotPasswordCommandHandler = forgotPasswordCommandHandler;
        private readonly IResetPasswordCommandHandler _resetPasswordCommandHandler = resetPasswordCommandHandler;
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
        public async Task<IActionResult> Register(Application.DTOs.RegisterRequest request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage);

                return BadRequest(new CommandResult
                {
                    Success = false,
                    Message = string.Join(" | ", errors)
                });
            }

            var command = new RegisterCommand
            {
                UserName = request.UserName,
                Name = request.Name,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Password = request.Password,
                Role = request.Role
            };

            var result = await _registerCommandHandler.Handle(command);
            if (!result.Success)
                return BadRequest(new { error = result.Message});
            
            return Ok(result);
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
        public async Task<IActionResult> Login(Application.DTOs.LoginRequest request)
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

        /// <summary>
        /// Endpoint para obtener todos los usuarios con rol "DeliveryOperator"
        /// </summary>
        /// <returns></returns>
        [HttpGet("deliveryoperators")]
        [ProducesResponseType(typeof(List<DeliveryOperatorDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllDeliveryOperators()
        {
            var deliveryOperators = await _getAllDeliverysQueryHandler.HandleAsync();
            return Ok(deliveryOperators);
        }

        /// <summary>
        /// Cambia el estado laboral de un usuario (Active / Inactive).
        /// </summary>
        /// <param name="request">Datos del cambio de estado</param>
        /// <returns>200 OK si se actualiza, 400 si falla</returns>
        [HttpPost("change-status")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangeEmployedStatus(ChangeEmployedStatusRequest request)
        {
            var command = new ChangeEmployedStatusCommand(request.UserIdentityId, request.NewStatus);

            var result = await _changeEmployedStatusCommandHandler.Handle(command);

            if (!result.Success)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = result.Message });
        }

        /// <summary>
        /// Marca un usuario como obligado a crear una nueva contraseña.
        /// </summary>
        /// <returns>200 OK si se modifica correctamente</returns>
        [HttpPost("set-must-create-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SetMustCreatePassword(SetMustCreatePasswordRequest request)
        {
            var command = new SetMustCreatePasswordCommand(request.UserIdentityId);

            var result = await _setMustCreatePasswordCommandHandler.Handle(command);

            if (!result.Success)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = result.Message });
        }

        /// <summary>
        /// Permite que un usuario genere su nueva contraseña cuando MustCreatePassword = true.
        /// </summary>
        /// <returns>200 OK si la contraseña se cambió correctamente</returns>
        [HttpPost("create-new-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateNewPassword([FromBody] CreateNewPasswordRequest request)
        {
            var command = new CreateNewPasswordCommand(request.UserIdentityId, request.NewPassword);

            var result = await _createNewPasswordCommandHandler.Handle(command);

            if (!result.Success)
                return BadRequest(new { error = result.Message });

            return Ok(new { message = result.Message });
        }

        /// <summary>
        /// Permite a un usuario iniciar el proceso de recuperación de contraseña.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var command = new ForgotPasswordCommand(request.Email);
            var result = await _forgotPasswordCommandHandler.HandleAsync(command);

            return Ok(result);
        }

        /// <summary>
        /// Permite a un usuario restablecer su contraseña utilizando un token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var command = new ResetPasswordCommand(request.Email, request.Token, request.NewPassword);

            var result = await _resetPasswordCommandHandler.Handle(command);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }

    }
}
