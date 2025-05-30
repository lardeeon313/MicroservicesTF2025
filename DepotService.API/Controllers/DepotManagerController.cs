using DepotService.Application.Commands.DepotManager.AssignOperator;
using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam;
using DepotService.Application.Commands.DepotManager.UpdateTeam;
using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.Queries.DepotManager.GetAllTeams;
using DepotService.Application.Queries.DepotManager.GetTeamById;
using DepotService.Application.Queries.DepotManager.GetTeamByName;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepotService.API.Controllers
{
    [Authorize(Roles = "DepotManager")]
    [ApiController]
    [Route("api/depotmanager")]
    public class DepotManagerController(
        IAssignOrderCommandHandler assignOrderCommandHandler,
        ICreateTeamCommandHandler createTeamCommandHandler,
        IDeleteTeamCommandHandler deleteTeamCommandHandler,
        IUpdateTeamCommandHandler updateTeamCommandHandler,
        IAssignOperatorCommandHandler assignOperatorCommandHandler,
        IRemoveOperatorCommandHandler removeOperatorCommandHandler,
        IGetTeamByIdQueryHandler getTeamByIdQueryHandler,
        IGetAllTeamsQueryHandler getAllTeamsQueryHandler,
        IGetTeamByNameQueryHandler getTeamByNameQueryHandler
        ) : ControllerBase
    {
        private readonly IRemoveOperatorCommandHandler _RemoveOperatorCommandHandler = removeOperatorCommandHandler;
        private readonly ICreateTeamCommandHandler _CreateTeamCommandHandler = createTeamCommandHandler;
        private readonly IAssignOrderCommandHandler _AssignOrderCommandHandler = assignOrderCommandHandler;
        private readonly IDeleteTeamCommandHandler _DeleteTeamCommandHandler = deleteTeamCommandHandler;
        private readonly IUpdateTeamCommandHandler _UpdateTeamCommandHandler = updateTeamCommandHandler;
        private readonly IAssignOperatorCommandHandler _AssignOperatorCommandHandler = assignOperatorCommandHandler;
        private readonly IGetTeamByIdQueryHandler _GetTeamByIdQueryHandler = getTeamByIdQueryHandler;
        private readonly IGetAllTeamsQueryHandler _GetAllTeamsQueryHandler = getAllTeamsQueryHandler;
        private readonly IGetTeamByNameQueryHandler _GetTeamByNameQueryHandler = getTeamByNameQueryHandler;



        /// <summary>
        /// Asigna una orden a un operador.
        /// </summary>
        /// <param name="orderId">ID de la orden</param>
        /// <param name="request">Datos del operador</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Asignación exitosa</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404">Orden no encontrada</response>
        [HttpPost("{orderId}/assign")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AssignOperator(int orderId, [FromBody] AssignOrderRequest request)
        {
            var command = new AssignOrderCommand(orderId, request.OperatorUserId);
            await _AssignOrderCommandHandler.HandleAsync(command);
            return Ok();
        }

        /// <summary>
        /// Asigna un operador a un equipo
        /// </summary>
        /// <param name="teamId">ID de la orden</param>
        /// <param name="request">Datos del operador</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Asignación exitosa</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404">Orden no encontrada</response>
        [HttpPost("{teamId}/assign-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]

        public async Task<IActionResult> AssignOperatorToTeam(int teamId, [FromBody] AssignOperatorRequest request)
        {
            var command = new AssignOperatorCommand(request.OperatorUserId, teamId);
            await _AssignOperatorCommandHandler.AssignOperatorAsync(command);
            return Ok();
        }

        /// <summary>
        /// Remover un operador de un equipo 
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="operatorUserId"></param>
        /// <returns></returns>
        [HttpDelete("{teamId}/remove-operator/{operatorUserId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveOperator(int teamId, Guid operatorUserId)
        {
            var command = new RemoveOperatorCommand(operatorUserId, teamId);
            await _RemoveOperatorCommandHandler.RemoveOperatorAsync(command);
            return Ok();
        }



        /// <summary>
        /// Crea un equipo de operarios
        /// </summary>
        /// <param name="request">Datos del Equipo</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Se creo correctamente el equipo</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404"></response>
        [HttpPost("create-team")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var command = new CreateTeamCommand(request.TeamName, request.TeamDescription);
            var result = await _CreateTeamCommandHandler.HandleAsync(command);
            return Ok(result);
        }


        /// <summary>
        /// Elimina un equipo de operarios
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpDelete("delete-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var command = new DeleteTeamCommand(teamId);
            await _DeleteTeamCommandHandler.DeleteTeamHandler(command);
            return Ok();
        }


        /// <summary>
        /// Modifica un equipo de operarios
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("update-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTeam(int teamId, [FromBody] UpdateTeamRequest request)
        {
            var command = new UpdateTeamCommand(teamId, request.TeamName, request.TeamDescription);
            await _UpdateTeamCommandHandler.UpdateTeamHandle(command);
            return Ok();
        }

        /// <summary>
        /// Devuelve el equipo de operarios por su Id 
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpGet("get-team-by-id/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTeamById(int teamId)
        {
            var query = new GetTeamByIdQuery(teamId);
            var team = await _GetTeamByIdQueryHandler.GetByIdHandle(query);
            return team is not null ? Ok(team) : NotFound(new { message = "Team not found." });
        }

        /// <summary>
        /// Devuelve todos los equipos existentes
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-teams")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams = await _GetAllTeamsQueryHandler.HandleAsync();
            return Ok(teams);
        }

        /// <summary>
        /// Devuelve un equipo de operarios por su nombre
        /// </summary>
        /// <param name="teamName"></param>
        /// <returns></returns>
        [HttpGet("get-team-by-name")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTeamByName(string teamName)
        {
            var query = new GetTeamByNameQuery(teamName);
            var team = await _GetTeamByNameQueryHandler.GetTeamByNameHandler(query);
            return team is not null ? Ok(team) : NotFound(new { message = "Team not found." });

        }

    }
}
