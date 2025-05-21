using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.DTOs.DepotManager.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepotService.API.Controllers
{
    [Authorize(Roles = "DepotManager")]
    [ApiController]
    [Route("api/depotmanager")]
    public class DepotManagerController(
        IAssignOrderCommandHandler AssignOrderCommandHandler
        ) : ControllerBase
    {
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
        public async Task<IActionResult> AssignOrder(int orderId, [FromBody] AssignOperatorRequest request)
        {
            var command = new AssignOrderCommand(orderId, request.OperatorId, request.OperatorName);
            await _AssignOrderCommandHandler.HandleAsync(command);
            return Ok();
        }

    }
}
