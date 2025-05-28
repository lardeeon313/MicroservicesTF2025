using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.DTOs.DepotManager.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepotService.API.Controllers
{
    [Authorize(Roles = "DepotManager")]
    [ApiController]
    [Route("api/depotmanager")]
    public class DepotManagerController(
        IAssignOrderCommandHandler AssignOrderCommandHandler,
        ICreateTeamCommandHandler CreateTeamCommandHandler
        ) : ControllerBase
    {
        private readonly ICreateTeamCommandHandler _CreateTeamCommandHandler = CreateTeamCommandHandler;
        private readonly IAssignOrderCommandHandler _AssignOrderCommandHandler = AssignOrderCommandHandler;

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
        public async Task<IActionResult> AssignOperator(int orderId, [FromBody] AssignOperatorRequest request)
        {
            var command = new AssignOrderCommand(orderId, request.OperatorUserId);
            await _AssignOrderCommandHandler.HandleAsync(command);
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
            var command = new CreateTeamCommand(request.TeamName);
            var result = await _CreateTeamCommandHandler.HandleAsync(command);
            return Ok(result);
        }

    }
}
