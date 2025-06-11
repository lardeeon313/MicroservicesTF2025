using DepotService.Application.Commands.DepotManager.AssignOperator;
using DepotService.Application.Commands.DepotManager.AssignOrder;
using DepotService.Application.Commands.DepotManager.CreateTeam;
using DepotService.Application.Commands.DepotManager.DeleteTeam;
using DepotService.Application.Commands.DepotManager.OrderMissingReported;
using DepotService.Application.Commands.DepotManager.RemoveOperatorToTeam;
using DepotService.Application.Commands.DepotManager.UpdateTeam;
using DepotService.Application.DTOs.DepotManager;
using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.Queries.DepotManager.GetAllMissingOrders;
using DepotService.Application.Queries.DepotManager.GetAllOrders;
using DepotService.Application.Queries.DepotManager.GetAllTeams;
using DepotService.Application.Queries.DepotManager.GetByIdOrder;
using DepotService.Application.Queries.DepotManager.GetMissingOrderById;
using DepotService.Application.Queries.DepotManager.GetOrdersByStatus;
using DepotService.Application.Queries.DepotManager.GetTeamById;
using DepotService.Application.Queries.DepotManager.GetTeamByName;
using DepotService.Application.Validators.DepotManager;
using DepotService.Domain.Enums;
using FluentValidation;
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
        IGetTeamByNameQueryHandler getTeamByNameQueryHandler,
        IOrderMissingReportedCommandHandler orderMissingReportedCommandHandler,
        OrderMissingReportedCommandValidator orderMissingReportedCommandValidator,
        IGetOrdersByStatusQueryHandler getOrdersByStatusQueryHandler,
        IGetAllOrdersQueryHandler getAllOrdersQueryHandler,
        IGetByIdOrderQueryHandler getByIdOrderQueryHandler,
        IGetMissingOrderByIdQueryHandler getMissingOrderByIdQueryHandler,
        IGetAllMissingOrdersQueryHandler getAllMissingOrdersQueryHandler
        
        ) : ControllerBase
    {
        private readonly OrderMissingReportedCommandValidator _OrderMissingReportedCommandValidator = orderMissingReportedCommandValidator;
        private readonly IOrderMissingReportedCommandHandler _OrderMissingReportedCommandHandler = orderMissingReportedCommandHandler;
        private readonly IRemoveOperatorCommandHandler _RemoveOperatorCommandHandler = removeOperatorCommandHandler;
        private readonly ICreateTeamCommandHandler _CreateTeamCommandHandler = createTeamCommandHandler;
        private readonly IAssignOrderCommandHandler _AssignOrderCommandHandler = assignOrderCommandHandler;
        private readonly IDeleteTeamCommandHandler _DeleteTeamCommandHandler = deleteTeamCommandHandler;
        private readonly IUpdateTeamCommandHandler _UpdateTeamCommandHandler = updateTeamCommandHandler;
        private readonly IAssignOperatorCommandHandler _AssignOperatorCommandHandler = assignOperatorCommandHandler;
        private readonly IGetTeamByIdQueryHandler _GetTeamByIdQueryHandler = getTeamByIdQueryHandler;
        private readonly IGetAllTeamsQueryHandler _GetAllTeamsQueryHandler = getAllTeamsQueryHandler;
        private readonly IGetTeamByNameQueryHandler _GetTeamByNameQueryHandler = getTeamByNameQueryHandler;
        private readonly IGetOrdersByStatusQueryHandler _GetOrdersByStatusQueryHandler = getOrdersByStatusQueryHandler;
        private readonly IGetAllOrdersQueryHandler _GetAllOrdersQueryHandler = getAllOrdersQueryHandler;
        private readonly IGetByIdOrderQueryHandler _GetByIdOrderQueryHandler = getByIdOrderQueryHandler;
        private readonly IGetMissingOrderByIdQueryHandler _GetMissingOrderByIdQueryHandler = getMissingOrderByIdQueryHandler;
        private readonly IGetAllMissingOrdersQueryHandler _GetAllMissingOrdersQueryHandler = getAllMissingOrdersQueryHandler;


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

        /// <summary>
        /// Reporta una orden como faltante.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("report-missing-order")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ReportMissingOrder(OrderMissingReportedRequest request)
        {
            var validationResult = await _OrderMissingReportedCommandValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            var command = new OrderMissingReportedCommand(
                request.DepotOrderId,
                request.MissingItems.Select(item => new DepotOrderItemsReportedDto
                {
                    OrderItemId = item.OrderItemId,
                    Quantity = item.Quantity,
                    ProductBrand = item.ProductBrand,
                    ProductName = item.ProductName
                }).ToList(),
                request.SalesOrderId,
                request.MissingReason,
                request.MissingDescription
            );

            var result = await _OrderMissingReportedCommandHandler.OrderMissingHandle(command);
            return result 
                ? Ok(new { message = "Order missing reported successfully." })
                : BadRequest(new { error = "Failed to report order missing." });
        }

        /// <summary>
        /// Consultar las ordenes por su estado
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-status/{status}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByStatus(string status)
        {
            var query = await _GetOrdersByStatusQueryHandler.GetOrderByStatusHandlerAsync(status);
            return query is not null ? Ok(query) 
                : NotFound(new { message = "Orders not found." });

        }

        /// <summary>
        /// Consultar todas las ordenes
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-orders")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _GetAllOrdersQueryHandler.AllOrdersHandleAsync();
            return Ok(orders);
        }

        /// <summary>
        /// Consultar una orden por su Id
        /// </summary>
        /// <param name="depotOrderId"></param>
        /// <returns></returns>
        [HttpGet("get-order-by-id/{depotOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByIdOrder(int depotOrderId)
        {
            var order = await _GetByIdOrderQueryHandler.GetByIdOrderHandler(depotOrderId);
            return order is not null ? Ok(order) : NotFound(new { message = "Order not found." });
        }

        /// <summary>
        /// Consultar las ordenes con faltantes.
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-missing-orders")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMissingOrders()
        {
            var ordersMissing = await _GetAllMissingOrdersQueryHandler.GetAllMissingOrdersAsync();
            return Ok(ordersMissing);
        }

        /// <summary>
        /// Consultar una orden faltante por su Id
        /// </summary>
        /// <param name="missingOrderId"></param>
        /// <returns></returns>
        [HttpGet("get-missing-order-by-id/{missingOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMissingOrderById(int missingOrderId)
        {
            var orderMissing = await _GetMissingOrderByIdQueryHandler.GetMissingOrderByIdAsync(missingOrderId);
            return orderMissing is not null ? Ok(orderMissing) : NotFound(new { message = "Missing order not found." });

        }







    }
}
