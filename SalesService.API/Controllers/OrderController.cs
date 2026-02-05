using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesService.API.RequestDtos.OrderSatisfaction;
using SalesService.Application.Commands.Orders.Cancel;
using SalesService.Application.Commands.Orders.CreateOrderSatisfaction;
using SalesService.Application.Commands.Orders.Delete;
using SalesService.Application.Commands.Orders.OrderReissued;
using SalesService.Application.Commands.Orders.Register;
using SalesService.Application.Commands.Orders.Update;
using SalesService.Application.Commands.Orders.UpdateMissingOrder;
using SalesService.Application.Commands.Orders.UpdateStatus;
using SalesService.Application.DTOs.Customer;
using SalesService.Application.DTOs.Order;
using SalesService.Application.DTOs.Order.Request;
using SalesService.Application.Queries.Customers.GetCustomerAddresses;
using SalesService.Application.Queries.Orders.GetAll;
using SalesService.Application.Queries.Orders.GetAllMissingOrders;
using SalesService.Application.Queries.Orders.GetById;
using SalesService.Application.Queries.Orders.GetByIdCustomer;
using SalesService.Application.Queries.Orders.GetByStatus;
using SalesService.Application.Queries.Orders.GetOrderForSatisfaction;
using SalesService.Application.Queries.Orders.GetPagedOrders;
using SalesService.Application.Validators.Order;
using SalesService.Domain.Enums;
using System.Reflection.Metadata;
using System.Runtime.InteropServices;

namespace SalesService.API.Controllers
{
    [AllowAnonymous]
    //[Authorize] Una vez finalizado con adminservice, esto se activara. 
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
        IGetPagedOrdersQueryHandler getPagedOrdersQueryHandler,        
        IValidator<UpdateOrderStatusRequest> updateOrderStatusValidator,
        IValidator<RegisterOrderRequest> registerOrderValidator,
        IValidator<RegisterOrderItemRequest> registerOrderItemValidator,
        IValidator<UpdateOrderRequest> updateOrderValidator,
        IValidator<OrderReissuedRequest> orderReissuedValidator,
        IOrderReissuedCommandHandler orderReissuedCommandHandler,
        IUpdateMissingOrderCommandHandler updateMissingOrderCommandHandler,
        IValidator<UpdateOrderMissingRequest> updateOrderMissingValidator,
        IGetAllMissingOrdersQueryHandler getAllMissingOrdersQueryHandler,
        IGetCustomerAddressesQueryHandler getCustomerAddressesQueryHandler,
        ICreateOrderSatisfactionCommandHandler createOrderSatisfactionCommandHandler,
        IGetOrderForSatisfactionQueryHandler getOrderForSatisfactionQueryHandler
        ) : ControllerBase
    {
        private readonly IGetCustomerAddressesQueryHandler _getCustomerAddressesQueryHandler = getCustomerAddressesQueryHandler;
        private readonly IGetAllMissingOrdersQueryHandler _getAllMissingOrdersQueryHandler = getAllMissingOrdersQueryHandler;
        private readonly IValidator<UpdateOrderMissingRequest> _updateOrderMissingValidator = updateOrderMissingValidator;
        private readonly IUpdateMissingOrderCommandHandler _updateMissingOrderCommandHandler = updateMissingOrderCommandHandler;
        private readonly IValidator<OrderReissuedRequest> _orderReissuedValidator = orderReissuedValidator;
        private readonly IOrderReissuedCommandHandler _orderReissuedCommandHandler = orderReissuedCommandHandler;
        private readonly IRegisterOrderCommandHandler _registerOrderCommandHandler = registerOrderCommandHandler;
        private readonly IUpdateOrderCommandHandler _updateOrderCommandHandler = updateOrderCommandHandler;
        private readonly IUpdateOrderStatusCommandHandler _updateOrderStatusCommandHandler = updateOrderStatusCommandHandler;
        private readonly ICancelOrderCommandHandler _cancelOrderCommandHandler = cancelOrderCommandHandler;
        private readonly IDeleteOrderCommandHandler _deleteOrderCommandHandler = deleteOrderCommandHandler;
        private readonly ICreateOrderSatisfactionCommandHandler createOrderSatisfactionCommandHandler = createOrderSatisfactionCommandHandler;
        private readonly IGetPagedOrdersQueryHandler _getPagedOrdersQueryHandler = getPagedOrdersQueryHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;
        private readonly IGetOrderByStatusQueryHandler _getOrderByStatusQueryHandler = getOrderByStatusQueryHandler;
        private readonly IGetAllOrdersQueryHandler _getAllOrdersQueryHandler = getAllOrdersQueryHandler;       
        private readonly IGetOrderByIdCustomerQueryHandler _getOrderByIdCustomerQueryHandler = getOrderByIdCustomerQueryHandler;        
        private readonly IValidator<UpdateOrderStatusRequest> _updateOrderStatusValidator = updateOrderStatusValidator;
        private readonly IValidator<RegisterOrderRequest> _registerOrderValidator = registerOrderValidator;
        private readonly IValidator<RegisterOrderItemRequest> _registerOrderItemValidator = registerOrderItemValidator;
        private readonly IValidator<UpdateOrderRequest> _updateOrderValidator = updateOrderValidator;        
        private readonly IGetOrderForSatisfactionQueryHandler getOrderForSatisfactionQueryHandler = getOrderForSatisfactionQueryHandler;


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

            var command = new RegisterOrderCommand(request.CustomerId, request.Items, request.DeliveryDate, request.DeliveryDetail, request.CreatedByUserId, request.DeliveryAddress, request.DeliveryAddressId, request.PaymentType);
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
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusRequest request)
        {
            var validation = await _updateOrderStatusValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            if (id != request.OrderId)
                return BadRequest(new { error = "Order ID in the URL does not match the Order ID in the request body." });

            var command = new UpdateOrderStatusCommand(id, request);
            var result = await _updateOrderStatusCommandHandler.HandleAsync(command);
            return Ok(new { message = $"Order Status change successfully.{result}" });

        }


        /// <summary>
        /// Cancela una orden de pedido
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("cancel/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CancelOrder(CancelOrderRequest request)
        {
            var command = new CancelOrderCommand(request);
            var result = await _cancelOrderCommandHandler.Handle(command);
            return Ok(new { message = "Order cancelled successfully." });
        }

        /// <summary>
        /// Elimina la nota de pedido
        /// </summary>
        /// <param name="request"></param>
        /// /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("delete/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteOrder([FromRoute] int id, [FromBody] DeleteOrderRequest request)
        {
            if (id != request.OrderId)
                return BadRequest(new { error = "Order ID in the URL does not match the Order ID in the request body." });

            var command = new DeleteOrderCommand(request);
            var result = await _deleteOrderCommandHandler.HandleAsync(command);
            return Ok(new { message = "Order deleted successfully." });
        }

        /// <summary>
        /// Obtiene una orden por su ID
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
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
        public async Task<IActionResult> GetByStatus(string status)
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

        /// <summary>
        /// Obtiene las direcciones asociadas a un cliente específico.
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        [HttpGet("addresses")]
        [ProducesResponseType(typeof(List<AddressDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCustomerAddresses(Guid customerId)
        {
            var query = new GetCustomerAddressesQuery(customerId);
            var addresses = await _getCustomerAddressesQueryHandler.HandleAsync(query);

            if (addresses == null || !addresses.Any())
                return NotFound(new { error = "No addresses found for this customer." });

            return Ok(addresses);
        }

        /// <summary>Obtiene pedidos con un maximo de 20</summary>
        [HttpGet("paged")]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPagedOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
        {
            var query = new GetPagedOrdersQuery(pageNumber, pageSize);
            var result = await _getPagedOrdersQueryHandler.Handle(query, cancellationToken);
            return Ok(result);
        }

        /// <summary> Reemite una orden de pedido</summary>
        [HttpPut("reissued")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ReissuedOrder(OrderReissuedRequest request)
        {
            var validationResult = await _orderReissuedValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new OrderReissuedCommand(
                request.SalesOrderId,
                request.UpdateItems,
                request.DescriptionResolution
            );

            var result = await _orderReissuedCommandHandler.HandleOrderReissuedAsync(command);

            if (result)
            {
                return Ok(new { message = "Order reissued successfully." });
            }
            else
            {
                return BadRequest(new { error = "Failed to reissue order." });
            }
        }


        /// <summary>
        /// Actualiza una orden de pedido que se reportó como faltante.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("update/missingOrder/{id:int}")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMissingOrder(int id, [FromBody] UpdateOrderMissingRequest request)
        {
            if (id != request.OrderId)
                return BadRequest(new { error = "Order ID in the URL does not match the Order ID in the request body." });

            var validation = await _updateOrderMissingValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new UpdateMissingOrderCommand(id, request);
            var result = await _updateMissingOrderCommandHandler.HandleAsync(command);
            return Ok(result);
        }


        /// <summary>
        /// Obtiene todas las ordenes con faltantes. 
        /// </summary>
        /// <returns></returns>
        [HttpGet("missings")]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllMissings()
        {
            var result = await _getAllMissingOrdersQueryHandler.GetAllMissingOrdersAsync();
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para crear una satisfaccion de pedido
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("create/satisfaction")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateOrderSatisfaction(CreateOrderSatisfactionRequest request)
        {
            Console.WriteLine("📩 Llegó request para crear satisfacción");
            try
            {
                Console.WriteLine($"➡️ Token recibido: {request.Token}");
                Console.WriteLine($"➡️ Score recibido: {request.Score}");
                Console.WriteLine($"➡️ Comment recibido: {request.Comment}");

                var command = new CreateOrderSatisfactionCommand(
                    request.Token,
                    request.Score,
                    request.Comment
                );

                await createOrderSatisfactionCommandHandler.Handle(command);

                return Ok(new
                {
                    message = "Gracias por calificar tu pedido."
                });
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"❌ Error de negocio , no se esta guardando el satifaccion y el culpa del front: {ex.Message}");
                return BadRequest(new { error = ex.Message });

            }
        }

        /// <summary>
        /// Endpoint para obtener una orden para ser calificada
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpGet("public/orders/satisfaction")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrderForSatisfaction([FromQuery] string token)
        {
            var query = new GetOrderForSatisfactionQuery(token);
            var result = await getOrderForSatisfactionQueryHandler.Handle(query);

            if (result == null)
                return NotFound();

            return Ok(result);
        }



    }
}