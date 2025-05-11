using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SalesService.Application.Commands.Orders.Cancel;
using SalesService.Application.Commands.Orders.Delete;
using SalesService.Application.Commands.Orders.Register;
using SalesService.Application.Commands.Orders.Update;
using SalesService.Application.Commands.Orders.UpdateStatus;
using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Application.Queries.Orders.GetAll;
using SalesService.Application.Queries.Orders.GetById;
using SalesService.Application.Queries.Orders.GetByIdCustomer;
using SalesService.Application.Queries.Orders.GetByStatus;
using SalesService.Application.Validators.Order;

namespace SalesService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController(
        IRegisterOrderCommandHandler registerOrderCommandHandler,
        IUpdateOrderCommandHandler updateOrderCommandHandler,
        IUpdateOrderStatusCommandHandler updateOrderStatusCommandHandler,
        ICancelOrderCommandHandler cancelOrderCommandHandler,
        IDeleteOrderCommandHandler deleteOrderCommandHandler,
        IGetOrderByIdQueryHandler getOrderByIdQueryHandler,
        IGetOrderByStatusQueryHandler getOrderByStatusQueryHandler,
        IGetAllOrdersQueryHandler getAllOrdersQueryHandler,
        IGetOrderByIdCustomerQueryHandler getOrderByIdCustomerQueryHandler,
        IValidator<UpdateOrderStatusRequest> updateOrderStatusValidator,
        IValidator<RegisterOrderRequest> registerOrderValidator,
        IValidator<RegisterOrderItemRequest> registerOrderItemValidator,
        IValidator<UpdateOrderRequest> updateOrderValidator
        ) : ControllerBase
    {
        private readonly IRegisterOrderCommandHandler _registerOrderCommandHandler = registerOrderCommandHandler;
        private readonly IUpdateOrderCommandHandler _updateOrderCommandHandler = updateOrderCommandHandler;
        private readonly IUpdateOrderStatusCommandHandler _updateOrderStatusCommandHandler = updateOrderStatusCommandHandler;
        private readonly ICancelOrderCommandHandler _cancelOrderCommandHandler = cancelOrderCommandHandler;
        private readonly IDeleteOrderCommandHandler _deleteOrderCommandHandler = deleteOrderCommandHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;
        private readonly IGetOrderByStatusQueryHandler _getOrderByStatusQueryHandler = getOrderByStatusQueryHandler;
        private readonly IGetAllOrdersQueryHandler _getAllOrdersQueryHandler = getAllOrdersQueryHandler;
        private readonly IGetOrderByIdCustomerQueryHandler _getOrderByIdCustomerQueryHandler = getOrderByIdCustomerQueryHandler;
        private readonly IValidator<UpdateOrderStatusRequest> _updateOrderStatusValidator = updateOrderStatusValidator;
        private readonly IValidator<RegisterOrderRequest> _registerOrderValidator = registerOrderValidator;
        private readonly IValidator<RegisterOrderItemRequest> _registerOrderItemValidator = registerOrderItemValidator;
        private readonly IValidator<UpdateOrderRequest> _updateOrderValidator = updateOrderValidator;


        /// <summary>
        /// Registra una nueva orden de pedido.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterOrder([FromBody] RegisterOrderRequest request)
        {
            var validation = await _registerOrderValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new RegisterOrderCommand(request.CustomerId, request.Items, request.DeliveryDate, request.DeliveryDetail);
            var result = await _registerOrderCommandHandler.HandleAsync(command);
            return Ok(result);

        }

        /// <summary>
        /// Actualiza una orden de pedido.
        /// </summary>
        [HttpPut("update/{id:int}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
        {
            if (id != request.OrderId)
                return BadRequest(new { error = "Order ID in the URL does not match the Order ID in the request body." });

            var validation = await _updateOrderValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new UpdateOrderCommand(id, request);
            var result = await _updateOrderCommandHandler.HandleAsync(command);
            return Ok(result);
        }

        /// <summary>
        /// Actualiza únicamente el estado de una orden de pedido.
        /// </summary>
        [HttpPut("updateStatus/{id:int}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateStatus (int id, UpdateOrderStatusRequest request)
        {
            var validation = await _updateOrderStatusValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            if (id != request.OrderId)
                return BadRequest(new { error = "Order ID in the URL does not match the Order ID in the request body." });

            var command = new UpdateOrderStatusCommand(id,request);
            var result = await _updateOrderStatusCommandHandler.HandleAsync(command);
            return Ok(new {message = $"Order Status change successfully.{result}"} );

        }


        /// <summary>
        /// Cancela una orden de pedido
        /// </summary>
        /// <param name="id"></param>
        /// <param name="reason"></param>
        /// <returns></returns>
        [HttpPut("cancel/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CancelOrder(int id,string reason)
        {
            var command = new CancelOrderCommand(id,reason);
            var result = await _cancelOrderCommandHandler.Handle(command);
            return Ok(new { message = "Order cancelled successfully." });
        }

        /// <summary>
        /// Elimina la nota de pedido
        /// </summary>
        /// <param name="id"></param>
        /// /// <param name="reason"></param>
        /// <returns></returns>
        [HttpDelete("delete/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteOrder(int id,string reason)
        {
            var command = new DeleteOrderCommand(id,reason);
            var result = await _deleteOrderCommandHandler.HandleAsync(command);
            return Ok(new { message = "Order deleted successfully." });
        }

        /// <summary>
        /// Obtiene una orden por su ID
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById (int id)
        {
            var query = new GetOrderByIdQuery(id);
            var result = await _getOrderByIdQueryHandler.Handle(query);

            return Ok(result);
        }

        /// <summary>
        /// Obtiene todas las ordenes 
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var result = await _getAllOrdersQueryHandler.Handle();
            return Ok(result);
        }

        /// <summary>
        /// Obtiene las ordenes por estado
        /// </summary>
        [HttpGet("status/{status}")]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStatus (string status)
        {
            var result = await _getOrderByStatusQueryHandler.HandleAsync(status);
            return Ok(result);
        }

        /// <summary>Obtiene pedidos por cliente</summary>
        [HttpGet("customer/{customerId:guid}")]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByCustomer(Guid customerId)
        {
            var query = new GetOrderByIdCustomerQuery(customerId);

            var result = await _getOrderByIdCustomerQueryHandler.HandleAsync(query);
            return Ok(result);
        }



    }
}
