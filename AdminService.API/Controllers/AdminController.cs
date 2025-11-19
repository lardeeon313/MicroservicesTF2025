using AdminService.API.RequestDtos;
using AdminService.Application.Commands.Employees.ChangeStatusEmployee;
using AdminService.Application.Commands.Employees.RegisterEmployee;
using AdminService.Application.Commands.Employees.UpdateEmployee;
using AdminService.Application.Queries.Employee.GetAllEmployees;
using AdminService.Application.Queries.Employee.GetEmployeeByDni;
using AdminService.Application.Queries.Employees.GetEmployeeByDni;
using AdminService.Application.Queries.Employees.GetEmployeeById;
using AdminService.Application.Queries.Employees.GetEmployeesBySector;
using AdminService.Application.Queries.Employees.GetEmployeesByStatus;
using AdminService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController(
        IRegisterEmployeeCommandHandler registerEmployeeCommandHandler,
        IUpdateEmployeeCommandHandler updateEmployeeCommandHandler,
        IChangeStatusEmployeeCommandHandler changeStatusEmployeeCommandHandler,

        IGetAllEmployeesQueryHandler getAllEmployeesQueryHandler,
        IGetEmployeesByStatusQueryHandler getEmployeesByStatusQueryHandler,
        IGetEmployeeByDniQueryHandler getEmployeeByDniQueryHandler,
        IGetEmployeeByIdQueryHandler getEmployeeByIdQueryHandler,
        IGetEmployeesBySectorQueryHandler getEmployeesBySectorQueryHandler

        ) : ControllerBase
    {
        private readonly IRegisterEmployeeCommandHandler _registerEmployeeCommandHandler = registerEmployeeCommandHandler;
        private readonly IUpdateEmployeeCommandHandler _updateEmployeeCommandHandler = updateEmployeeCommandHandler;
        private readonly IGetAllEmployeesQueryHandler _getAllEmployeesQueryHandler = getAllEmployeesQueryHandler;
        private readonly IGetEmployeesByStatusQueryHandler _getEmployeesByStatusQueryHandler = getEmployeesByStatusQueryHandler;
        private readonly IGetEmployeeByDniQueryHandler _getEmployeeByDniQueryHandler = getEmployeeByDniQueryHandler;
        private readonly IGetEmployeeByIdQueryHandler _getEmployeeByIdQueryHandler = getEmployeeByIdQueryHandler;
        private readonly IChangeStatusEmployeeCommandHandler _changeStatusEmployeeCommandHandler = changeStatusEmployeeCommandHandler;
        private readonly IGetEmployeesBySectorQueryHandler _getEmployeesBySectorQueryHandler = getEmployeesBySectorQueryHandler;


        /// <summary>
        /// Crea empleado
        /// </summary>
        /// <param name="request">Datos del empleado</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Se creo correctamente el equipo</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404"></response>
        [HttpPost("create-employee")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RegisterEmployee([FromBody] RegisterEmployeeRequest request)
        {
            var command = new RegisterEmployeeCommand(request.UserName, request.FirstName, request.LastName, request.Dni, request.Email, request.PhoneNumber, request.Role, request.Status, request.Sector);
            var result = await _registerEmployeeCommandHandler.RegisterEmployeeAsync(command);
            return Ok(result);
        }

        /// <summary>
        /// Actualiza empleado
        /// </summary>
        /// <param name="request">Datos del empleado</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Se creo correctamente el equipo</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404"></response>
        [HttpPost("Update-employee")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateEmployee([FromBody] UpdateEmployeeRequest request)
        {
            var command = new UpdateEmployeeCommand(request.Id,request.UserName, request.FirstName, request.LastName, request.Dni, request.Email, request.PhoneNumber, request.Role, request.Status, request.Sector);
            var result = await _updateEmployeeCommandHandler.UpdateEmployeeAsync(command);
            return Ok(result);
        }

        /// <summary>
        /// Actualiza solo el estado del empleado
        /// </summary>
        /// <param name="request">Id y Estado Nuevo</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Se creo correctamente el equipo</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404"></response>
        [HttpPost("change-status-employee")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ChangeStatusEmployee([FromBody] ChangeStatusEmployeeRequest request)
        {
            var command = new ChangeStatusEmployeeCommand(request.Id, request.Status);
            var result = await _changeStatusEmployeeCommandHandler.ChangeStatusEmployeeAsync(command);
            return Ok(result);
        }

        //////// Queries ////////

        /// <summary>
        /// Devuelve todos los empleados existentes
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-employees")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllEmployees()
        {
            var query = await _getAllEmployeesQueryHandler.GetAllEmployeesAsync();
            return Ok(query);
        }

        /// <summary>
        /// Devuelve un empleado por su Id
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-employee-by-id")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEmployeeById(int EmployeeId)
        {
            var query = new GetEmployeeByIdQuery(EmployeeId);
            var result = await _getEmployeeByIdQueryHandler.GetEmployeeById(query);
            return Ok(result);
        }

        /// <summary>
        /// Devuelve un empleado por su Dni
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-employee-by-dni")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEmployeeByDni(string dni)
        {
            var query = new GetEmployeeByDniQuery(dni);
            var result = await _getEmployeeByDniQueryHandler.GetEmployeeByDniAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// Devuelve empleados por su estado
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-employees-by-status")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEmployeesByStatus(EmployeeStatus status)
        {
            var query = new GetEmployeesByStatusQuery(status);
            var result = await _getEmployeesByStatusQueryHandler.GetEmployeesByStatusAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// Devuelve los empleados por su sector
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-employees-by-sector")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEmployeesBySector(EmployeeSector sector)
        {
            var query = new GetEmployeesBySectorQuery(sector);
            var result = await _getEmployeesBySectorQueryHandler.GetEmployeesBySectorAsync(query);
            return Ok(result);
        }





    }
}
