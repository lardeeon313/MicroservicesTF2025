using LogisticService.API.RequestDtos.DeliveryOperator.LogisticOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ConfirmOrderAssign;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderDelivered;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.MarkOrderOnTheWay;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.RejectAssignedOrder;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ReportDeliveryIncident;
using LogisticService.Application.Commands.DeliveryOperator.LogisticOrder.ResolveDeliveryIncident;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyAssignedOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyDeliveredOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyOnTheWayOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingCashOrders;
using LogisticService.Application.Queries.DeliveryOperator.LogisticOrder.GetMyPendingDeliveredOrders;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrderById;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByStatus;
using LogisticService.Domain.Enums;
using LogisticService.Domain.IRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/**************************************************************/
/**************************************************************/
//    CONTROLADOR PARA LOS ENDPOINTS DELIVERY OPERATOR        //
/**************************************************************/
/**************************************************************/
namespace LogisticService.API.Controllers
{
    [Authorize(Roles = "DeliveryOperator")]
    [ApiController]
    [Route("api/DeliveryOperator")]
    public class DeliveryOperatorController(
        IConfirmAssignedOrderCommandHandler confirmAssignedOrderCommandHandler,
        IRejectAssignedOrderCommandHandler rejectAssignedOrderCommandHandler,
        IMarkOrderOnTheWayCommandHandler markOrderOnTheWayCommandHandler,
        IMarkOrderDeliveredCommandHandler markOrderDeliveredCommandHandler,
        IReportDeliveryIncidentCommandHandler reportDeliveryIncidentCommandHandler,
        IResolveDeliveryIncidentCommandHandler resolveDeliveryIncidentCommandHandler,

        IGetMyAssignedOrdersQueryHandler getMyAssignedOrdersQueryHandler,
        IGetMyDeliveredOrdersQueryHandler getMyDeliveredOrdersQueryHandler,
        IGetMyPendingCashOrdersQueryHandler getMyPendingCashOrdersQueryHandler,
        IGetOrderByIdQueryHandler getOrderByIdQueryHandler,
        IGetOrdersByStatusQueryHandler getOrdersByStatusQueryHandler,
        IGetMyPendingDeliveredOrdersQueryHandler getMyPendingDeliveredOrdersQueryHandler,
        IGetMyOnTheWayOrdersQueryHandler getMyOnTheWayOrdersQueryHandler,
        IDeliveryTeamRepository deliveryTeamRepository

        ) : ControllerBase
    {
        private readonly IMarkOrderOnTheWayCommandHandler _markOrderOnTheWayCommandHandler = markOrderOnTheWayCommandHandler;
        private readonly IMarkOrderDeliveredCommandHandler _markOrderDeliveredCommandHandler = markOrderDeliveredCommandHandler;
        private readonly IConfirmAssignedOrderCommandHandler _confirmAssignedOrderCommandHandler = confirmAssignedOrderCommandHandler;
        private readonly IRejectAssignedOrderCommandHandler _rejectAssignedOrderCommandHandler = rejectAssignedOrderCommandHandler;
        private readonly IReportDeliveryIncidentCommandHandler _reportDeliveryIncidentCommandHandler = reportDeliveryIncidentCommandHandler;
        private readonly IResolveDeliveryIncidentCommandHandler _resolveDeliveryIncidentCommandHandler = resolveDeliveryIncidentCommandHandler;

        private readonly IGetOrdersByStatusQueryHandler _getOrdersByStatusQueryHandler = getOrdersByStatusQueryHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;
        private readonly IGetMyAssignedOrdersQueryHandler _getMyAssignedOrdersQueryHandler = getMyAssignedOrdersQueryHandler;
        private readonly IGetMyDeliveredOrdersQueryHandler _getMyDeliveredOrdersQueryHandler = getMyDeliveredOrdersQueryHandler;
        private readonly IGetMyPendingCashOrdersQueryHandler _getMyPendingCashOrdersQueryHandler = getMyPendingCashOrdersQueryHandler;
        private readonly IGetMyPendingDeliveredOrdersQueryHandler _getMyPendingDeliveredOrdersQueryHandler = getMyPendingDeliveredOrdersQueryHandler;
        private readonly IGetMyOnTheWayOrdersQueryHandler _getMyOnTheWayOrdersQueryHandler = getMyOnTheWayOrdersQueryHandler;
        //
        private readonly IDeliveryTeamRepository _deliveryTemaRepository = deliveryTeamRepository;


        /**************************************************************/
        /**************************************************************/
        /////           COMANDOS DELIVERY OPERATOR                //////
        /**************************************************************/
        /**************************************************************/


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
            try
            {
                // 🟩 Paso 1: Verificamos qué llega del front
                Console.WriteLine("===== 📩 ConfirmAssignedOrder recibido =====");
                Console.WriteLine($"LogisticOrderId: {request.LogisticOrderId}");
                Console.WriteLine($"OperatorUserId (raw): {request.OperatorUserId}");
                Console.WriteLine("===========================================");

                // 🟦 Paso 2: Validar GUID (por si viene como string vacío o inválido)
                if (!Guid.TryParse(request.OperatorUserId.ToString(), out var operatorGuid))
                {
                    Console.WriteLine("❌ OperatorUserId tiene formato inválido (no es un GUID)");
                    return BadRequest("OperatorUserId tiene un formato inválido.");
                }

                // 🟨 Paso 3: Crear el comando con valores ya verificados
                var command = new ConfirmAssignedOrderCommand(request.LogisticOrderId, operatorGuid);

                Console.WriteLine($"✅ Command creado con: LogisticOrderId={command.LogisticOrderId}, OperatorUserId={command.OperatorUserId}");

                // 🟧 Paso 4: Validar parámetros
                if (command.LogisticOrderId <= 0 || command.OperatorUserId == Guid.Empty)
                {
                    Console.WriteLine("⚠️ Command inválido, faltan parámetros requeridos.");
                    return BadRequest("Invalid command parameters.");
                }

                // 🟦 Paso 5: Ejecutar handler
                Console.WriteLine("🚀 Ejecutando handler ConfirmAssignedOrderAsync...");
                await _confirmAssignedOrderCommandHandler.ConfirmAssignedOrderAsync(command);
                Console.WriteLine("✅ Handler ejecutado correctamente.");

                return Ok("Order confirmed successfully.");
            }
            catch (Exception ex)
            {
                // 🟥 Loguear el error completo, incluyendo inner exception
                Console.WriteLine("💥 ERROR al confirmar pedido:");
                Console.WriteLine($"Tipo: {ex.GetType().Name}");
                Console.WriteLine($"Mensaje: {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"➡️ InnerException: {ex.InnerException.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Endpoint para rechazar un pedido asignado a un operador del Depósito.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("reject-assign")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RejectAssignedOrder([FromBody] RejectAssignOrderRequest request)
        {
            var command = new RejectAssignedOrderCommand(request.LogisticOrderId, request.OperatorUserId, request.Reason);
            if (command == null || command.LogisticOrderId <= 0 || command.OperatorUserId == Guid.Empty || string.IsNullOrWhiteSpace(command.Reason))
            {
                return BadRequest("Invalid command parameters.");
            }
            await _rejectAssignedOrderCommandHandler.RejectAssignedOrderAsync(command);
            return Ok("Order rejected successfully.");
        }

        /// <summary>
        /// Endpoint para marcar una orden como entregada.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("mark-on-the-way")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> MarkOrderOnTheWay([FromBody] MarkOrderOnTheWayRequest request)
        {
            var command = new MarkOrderOnTheWayCommand(request.LogisticOrderId, request.OperatorUserId);
            if (command == null || command.LogisticOrderId <= 0 || command.OperatorUserId == Guid.Empty)
            {
                return BadRequest("Invalid command parameters.");
            }
            await _markOrderOnTheWayCommandHandler.MarkOrderOnTheWayAsync(command);
            return Ok("Order marked as 'On The Way' successfully.");
        }

        /// <summary>
        /// Endpoint para marcar una orden como entregada.
        /// </summary>
        /// <param name="logisticOrderId"></param>
        /// <returns></returns>
        [HttpPost("mark-delivered")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> MarkOrderDelivered(int logisticOrderId)
        {
            var command = new MarkOrderDeliveredCommand(logisticOrderId);
            if (command == null || command.LogisticOrderId <= 0)
            {
                return BadRequest("Invalid command parameters.");
            }
            await _markOrderDeliveredCommandHandler.MarkOrderDelivered(command);
            return Ok("Order marked as 'Delivered' successfully.");
        }

        /// <summary>
        /// Endpoint para reportar un incidente de entrega.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("report-delivery-incident")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ReportDeliveryIncident([FromBody] ReportDeliveryIncidentRequest request)
        {
            var command = new ReportDeliveryIncidentCommand(
                request.LogisticOrderId,
                request.OperatorUserId,
                request.IncidentType,
                request.Description);
            if (command == null || command.LogisticOrderId <= 0 || command.OperatorUserId == Guid.Empty ||
                string.IsNullOrWhiteSpace(command.IncidentType) || string.IsNullOrWhiteSpace(command.Description))
            {
                return BadRequest("Invalid command parameters.");
            }
            await _reportDeliveryIncidentCommandHandler.ReportIncidentAsync(command);
            return Ok("Delivery incident reported successfully.");
        }

        /// <summary>
        /// Ednpoint para resolver un incidente de entrega.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("resolve-delivery-incident")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResolveDeliveryIncident([FromBody] ResolveDeliveryIncidentRequest request)
        {
            var command = new ResolveDeliveryIncidentCommand(
                request.IncidentId,
                request.LogisticOrderId,
                request.ResolutionStatus,
                request.ResolutionNotes
                );
            if (command == null || command.IncidentId <= 0 || command.LogisticOrderId <= 0 ||
                command.ResolvedAt == default)
            {
                return BadRequest("Invalid command parameters.");
            }
            await _resolveDeliveryIncidentCommandHandler.HandleAsync(command);
            return Ok("Delivery incident resolved successfully.");
        }


        /**************************************************************/
        /**************************************************************/
        /////         QUERIES PARA CONSULTAR LAS ORDENES          //////
        /**************************************************************/
        /**************************************************************/

        /// <summary>
        /// Endpoint para retornar una lista de ordenes por su estado
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-status/{status}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByStatus(string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
                return BadRequest(new { message = $"Invalid order status: {status}" });
            var query = new GetOrdersByStatusQuery(parsedStatus);
            var orders = await _getOrdersByStatusQueryHandler.GetOrdersByStatusHandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para obtener una orden por su ID.
        /// </summary>
        /// <param name="orderId"></param>
        /// <returns></returns>
        [HttpGet("get-order-by-id/{orderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var query = new GetOrderByIdQuery(orderId);
            var result = await _getOrderByIdQueryHandler.GetOrderByIdHandleAsync(query);
            if (result == null)
            {
                return NotFound("Order not found.");
            }
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener los pedidos entregados por un operador de logística.
        /// </summary>
        /// <param name="operatorId"></param>
        /// <returns></returns>
        [HttpGet("get-my-assigned-orders/{operatorId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyAssignedOrders(Guid operatorId)
        {
            var query = new GetMyAssignedOrdersQuery(operatorId);
            var result = await _getMyAssignedOrdersQueryHandler.GetMyAssignedOrders(query);
            if (result == null || !result.Any())
            {
                return NotFound("No assigned orders found.");
            }
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener los pedidos pendientes de pago en efectivo por un operador de logística.
        /// </summary>
        /// <param name="operatorId"></param>
        /// <returns></returns>
        [HttpGet("get-my-delivered-orders/{operatorId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyDeliveredOrders(Guid operatorId)
        {
            var query = new GetMyDeliveredOrdersQuery(operatorId);
            var result = await _getMyDeliveredOrdersQueryHandler.GetMyDeliveredOrders(query);
            if (result == null || !result.Any())
            {
                return NotFound("No delivered orders found.");
            }
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener los pedidos pendientes de pago en efectivo por un operador de logística.
        /// </summary>
        /// <param name="operatorId"></param>
        /// <returns></returns>
        [HttpGet("get-my-pending-cash-orders/{operatorId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyPendingCashOrders(Guid operatorId)
        {
            var query = new GetMyPendingCashOrdersQuery(operatorId);
            var result = await _getMyPendingCashOrdersQueryHandler.GetMyPendingCashOrders(query);
            if (result == null || !result.Any())
            {
                return NotFound("No pending cash orders found.");
            }
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener los pedidos en camino por un operador de logística.
        /// </summary>
        /// <param name="operatorId"></param>
        /// <returns></returns>
        [HttpGet("get-my-pending-delivered-orders/{operatorId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyPendingDeliveredOrders(Guid operatorId)
        {
            var query = new GetMyPendingDeliveredOrdersQuery(operatorId);
            var result = await _getMyPendingDeliveredOrdersQueryHandler.GetMyPendingDeliveredOrdersAsync(query);
            if (result == null || !result.Any())
            {
                return NotFound("No pending delivered orders found.");
            }
            return Ok(result);

        }

        /// <summary>
        /// Endpoint para obtener los pedidos en camino por un operador de logística.
        /// </summary>
        /// <param name="operatorId"></param>
        /// <returns></returns>
        [HttpGet("get-my-on-the-way-orders/{operatorId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyOnTheWayOrders(Guid operatorId)
        {
            var query = new GetMyOnTheWayOrdersQuery(operatorId);
            var result = await _getMyOnTheWayOrdersQueryHandler.GetMyOnTheWayOrdersAsync(query);
            if (result == null || !result.Any())
            {
                return NotFound("No 'On The Way' orders found.");
            }
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener el equipo al que pertence el DeliveryOperator
        /// </summary>
        [HttpGet("teams/by-delivery/{operatorUserId}")]
        public async Task<IActionResult> GetTeamByDelivery(Guid operatorUserId)
        {
            var team = await _deliveryTemaRepository.GetTeamByOperatorAsync(operatorUserId);

            if (team == null)
                return NotFound(new { message = "El operador no tiene equipo asignado." });

            return Ok(new { teamName = team.TeamName });
        }

    }
}
