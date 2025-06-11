using DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder;
using DepotService.Application.DTOs.DepotOperator.Request;
using DepotService.Application.Queries.Operator.GetOrderById;
using DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepotService.API.Controllers
{
    [Authorize(Roles = "DepotOperator")]
    [ApiController]
    [Route("api/depotoperator")]
    public class DepotOperatorController(
        IGetOrdersByOperatorQueryHandler getOrdersByOperatorQueryHandler,
        IGetOrderByIdQueryHandler getOrderByIdQueryHandler,
        IConfirmAssignedOrderCommandHandler confirmAssignedOrderCommandHandler
        ) : ControllerBase
    {
        private readonly IConfirmAssignedOrderCommandHandler _confirmAssignedOrderCommandHandler = confirmAssignedOrderCommandHandler;
        private readonly IGetOrdersByOperatorQueryHandler _getOrdersByOperatorQueryHandler = getOrdersByOperatorQueryHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;


        /// <summary>
        /// Endpoint para obtener las órdenes asignadas a un operador específico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("get-orders-to-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByOperator([FromQuery] GetOrdersByOperatorQuery query)
        {
            if (query == null || query.OperatorUserId == Guid.Empty)
            {
                return BadRequest("Invalid query parameters.");
            }

            var orders = await _getOrdersByOperatorQueryHandler.GetOrdersByOperatorAsync(query);

            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found for the specified operator.");
            }
            return Ok(orders);
        }


        /// <summary>
        /// Endpoint para obtener un pedido del Depósito por su ID asociado a un operador específico.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("get-order-by-id")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderById([FromQuery] GetOrderByIdRequest request)
        {
            var query = new GetOrderByIdQuery(request.DepotOrderId, request.OperatorUserId);

            var order = await _getOrderByIdQueryHandler.GetOrderByIdHandler(query);
            if (order == null)
            {
                return NotFound($"Order with ID {request.DepotOrderId} not found for operator {request.OperatorUserId}.");
            }

            return Ok(order);
        }

        [HttpPost("confirm-assign")]
        public async Task<IActionResult> ConfirmAssignedOrder([FromBody] ConfirmAssignedOrderRequest request)
        {
            var command = new ConfirmAssignedOrderCommand(request.DepotOrderId, request.OperatorUserId);
            if (command == null || command.DepotOrderId <= 0 || command.OperatorUserId == Guid.Empty)
            {
                return BadRequest("Invalid command parameters.");
            }
            await _confirmAssignedOrderCommandHandler.HandleAsync(command);
            
            return Ok("Order confirmed successfully.");
        }
    }
}
