using DepotService.Application.Commands.DepotOperator.AddPackaing;
using DepotService.Application.Commands.DepotOperator.ConfirmAssignedOrder;
using DepotService.Application.Commands.DepotOperator.MarkItemReady;
using DepotService.Application.Commands.DepotOperator.RejectOrder;
using DepotService.Application.Commands.DepotOperator.ReportOrderMissing;
using DepotService.Application.Commands.DepotOperator.SentOrderToBilling;
using DepotService.Application.Commands.DepotOperator.UnMarkItemReady;
using DepotService.Application.DTOs.DepotManager.Request;
using DepotService.Application.DTOs.DepotOperator.Request;
using DepotService.Application.Queries.Operator.GetAssignedPendingOrders;
using DepotService.Application.Queries.Operator.GetOrderById;
using DepotService.Application.Queries.Operator.GetOrdersByOperatorQuery;
using DepotService.Application.Validators.DepotManager;
using DepotService.Application.Validators.DepotOperator;
using FluentValidation;
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
        IConfirmAssignedOrderCommandHandler confirmAssignedOrderCommandHandler,
        IReportOrderMissingCommandHandler reportOrderMissingCommandHandler,
        OrderMissingReportedCommandValidator orderMissingReportedCommandValidator,
        IAddPackaingCommandHandler addPackaingCommandHandler,
        AddPackaingCommandValidator addPackaingCommandValidator,
        ISentToBillingCommandHandler sentToBillingCommandHandler,
        RejectOrderCommandValidator rejectOrderCommandValidator,
        IRejectOrderCommandHandler rejectOrderCommandHandler,
        IMarkItemCommandHandler markItemCommandHandler,
        MarkItemIsReadyCommandValidator markItemIsReadyCommandValidator,
        UnmarkItemReadyValidator unmarkItemReadyValidator,
        IUnmarkItemReadyCommandHandler unmarkItemReadyCommandHandler,
        IGetAssignedPendingOrdersQueryHandler getAssignedPendingOrdersQueryHandler
        ) : ControllerBase
    {
        private readonly IGetAssignedPendingOrdersQueryHandler _getAssignedPendingOrdersQueryHandler = getAssignedPendingOrdersQueryHandler;
        private readonly UnmarkItemReadyValidator _unmarkItemReadyValidator = unmarkItemReadyValidator;
        private readonly IUnmarkItemReadyCommandHandler _unmarkItemReadyCommandHandler = unmarkItemReadyCommandHandler;
        private readonly MarkItemIsReadyCommandValidator _markItemIsReadyCommandValidator = markItemIsReadyCommandValidator;
        private readonly IMarkItemCommandHandler _markItemCommandHandler = markItemCommandHandler;
        private readonly IRejectOrderCommandHandler _rejectOrderCommandHandler = rejectOrderCommandHandler;
        private readonly RejectOrderCommandValidator _rejectOrderCommandValidator = rejectOrderCommandValidator;
        private readonly ISentToBillingCommandHandler _sentToBillingCommandHandler = sentToBillingCommandHandler;
        private readonly AddPackaingCommandValidator _addPackaingCommandValidator = addPackaingCommandValidator;
        private readonly IAddPackaingCommandHandler _addPackaingCommandHandler = addPackaingCommandHandler;
        private readonly OrderMissingReportedCommandValidator _orderMissingReportedCommandValidator = orderMissingReportedCommandValidator;
        private readonly IConfirmAssignedOrderCommandHandler _confirmAssignedOrderCommandHandler = confirmAssignedOrderCommandHandler;
        private readonly IGetOrdersByOperatorQueryHandler _getOrdersByOperatorQueryHandler = getOrdersByOperatorQueryHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;
        private readonly IReportOrderMissingCommandHandler _reportOrderMissingCommandHandler = reportOrderMissingCommandHandler;

        /// <summary>
        /// Endpoint para obtener las órdenes asignadas a un operador específico.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("get-orders-to-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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

        /// <summary>
        /// Endpoint para confirmar un pedido asignado a un operador del Depósito.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("confirm-assign")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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

        /// <summary>
        /// Endpoint para reportar un pedido del Depósito como faltante por parte de un operador.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("report-order-missing")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ReportOrderMissing([FromBody] OrderMissingReportedRequest request)
        {
            var validationResult = _orderMissingReportedCommandValidator.Validate(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var command = new ReportOrderMissingCommand
            {
                DepotOrderId = request.DepotOrderId,
                MissingReason = request.MissingReason,
                MissingDescription = request.MissingDescription,
                MissingItems = request.MissingItems
            };

            await _reportOrderMissingCommandHandler.HandleAsync(command);

            return Ok("Order reported as missing successfully.");
        }

        /// <summary>
        /// Endpoint para agregar empaques a un pedido del Depósito por parte de un operador.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("add-packagings")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddPackaings([FromBody] AddPackagingCommand command)
        {
            var validationResult = _addPackaingCommandValidator.Validate(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var result = await _addPackaingCommandHandler.AddPackaingAsync(command);

            if (!result)
            {
                return StatusCode(500, result ? "Packagings added successfully." : "Failed to add packagings.");
            }
            return Ok("Packagings added successfully.");
        }

        /// <summary>
        /// Endpoint para enviar un pedido del Depósito a facturación por parte de un operador.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("sent-to-billing")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SentToBilling([FromBody] SentOrderToBillingCommand command)
        {
            var result = await _sentToBillingCommandHandler.SentToBillingAsync(command);
            if (!result)
            {
                return BadRequest("Failed to send order to billing. Order not found or not in preparation status.");
            }
            return Ok("Order sent to billing successfully.");
        }

        /// <summary>
        /// Endpoint para rechazar un pedido asignado a un operador del Depósito.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("reject-order")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RejectOrder([FromBody] RejectOrderCommand command)
        {
            var validationResult = _rejectOrderCommandValidator.Validate(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var result = await _rejectOrderCommandHandler.RejectOrderHandleAsync(command);
            if (!result)
            {
                return StatusCode(500, "Failed to reject order.");
            }
            return Ok("Order rejected successfully.");
        }

        /// <summary>
        /// Endpoint para marcar un ítem de un pedido del Depósito como listo por parte de un operador.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("mark-item-is-ready")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> MarkItemIsReady([FromBody] MarkItemCommand command)
        {
            var validationResult = await _markItemIsReadyCommandValidator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var result = await _markItemCommandHandler.MarkItemHandler(command);
            if (!result)
            {
                return StatusCode(500, "Failed to mark item as ready.");
            }

            return Ok("Item marked as ready successfully.");
        }

        /// <summary>
        /// Endpoint para desmarcar un ítem de un pedido del Depósito como listo por parte de un operador.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("unmark-item-ready")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UnmarkItemReady([FromBody] UnmarkItemReadyCommand command)
        {
            var validationResult = await _unmarkItemReadyValidator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }

            var result = await _unmarkItemReadyCommandHandler.UnmarkItemReady(command);
            if (!result)
            {
                return StatusCode(500, "Failed to unmark item as ready.");
            }

            return Ok("Item unmarked as ready successfully.");
        }


        /// <summary>
        /// Endpoint para obtener los pedidos pendientes asignados a un operador del Depósito.
        /// </summary>
        /// <returns></returns>
        [HttpGet("assigned-pending-orders")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAssignedPendingOrders()
        {
            var orders = await _getAssignedPendingOrdersQueryHandler.GetAssignedPendingOrders();

            if (orders == null)
            {
                return NotFound("No pending orders found for the operator.");
            }
            return Ok(orders);
        }
    }
}
