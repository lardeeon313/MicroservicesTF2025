using Microsoft.AspNetCore.Mvc;
using SalesService.Application.Commands.Handlers.Orders;
using SalesService.Application.Commands.Orders;
using SalesService.Application.Handlers;
using SalesService.Application.Queries;

namespace SalesService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly CreateOrderHandler _createHandler;
        private readonly UpdateOrderHandler _updateHandler;
        private readonly CancelOrderHandler _cancelHandler;
        private readonly AttachReceiptHandler _attachHandler;
        private readonly GetOrdersHandler _listHandler;
        private readonly GetOrderDetailHandler _detailHandler;

        public OrderController(
            CreateOrderHandler createHandler,
            UpdateOrderHandler updateHandler,
            CancelOrderHandler cancelHandler,
            AttachReceiptHandler attachHandler,
            GetOrdersHandler listHandler,
            GetOrderDetailHandler detailHandler)
        {
            _createHandler = createHandler;
            _updateHandler = updateHandler;
            _cancelHandler = cancelHandler;
            _attachHandler = attachHandler;
            _listHandler = listHandler;
            _detailHandler = detailHandler;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateOrderCommand cmd)
        {
            var id = await _createHandler.HandleAsync(cmd);
            return Ok(new { OrderId = id });
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateOrderCommand cmd)
        {
            await _updateHandler.HandleAsync(cmd);
            return NoContent();
        }

        [HttpPatch("cancel")]
        public async Task<IActionResult> Cancel([FromBody] CancelOrderCommand cmd)
        {
            await _cancelHandler.HandleAsync(cmd);
            return NoContent();
        }

        [HttpPost("attach-receipt")]
        public async Task<IActionResult> AttachReceipt([FromBody] AttachReceiptCommand cmd)
        {
            await _attachHandler.HandleAsync(cmd);
            return NoContent();
        }

        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] string? status)
        {
            var orders = await _listHandler.HandleAsync(new GetOrdersQuery { Status = status });
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var order = await _detailHandler.HandleAsync(new GetOrderDetailQuery { OrderId = id });
            return order == null ? NotFound() : Ok(order);
        }
    }
}

