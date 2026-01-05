using DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf;
using DepotService.Application.Commands.BillingManager.InvoicedOrder;
using DepotService.Application.Commands.BillingManager.SetItemUnitPrices;
using DepotService.Application.Commands.BillingManager.UpdateInvoicedItemPrice;
using DepotService.Application.DTOs.DepotOrder;
using DepotService.Application.Queries.BillingManager.GetAllInvoicedOrders;
using DepotService.Application.Queries.BillingManager.GetBillingDetailsByOrder;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrderById;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByCustomer;
using DepotService.Application.Queries.BillingManager.GetInvoicedOrdersByDateRange;
using DepotService.Application.Queries.BillingManager.GetOrdersPendingBilling;
using DepotService.Application.Utilities;
using DepotService.Application.Validators.BillingManager;
using DepotService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;

namespace DepotService.API.Controllers
{

    [Authorize(Roles = "BillingManager,Admin")]
    [ApiController]
    [Route("api/billingmanager")]
    public class BillingManagerController(
        IGetOrdersPendingBillingQueryHandler getOrdersPendingBillingQueryHandler,
        IGetBillingDetailsByOrderIdQueryHandler getBillingDetailsByOrderIdQueryHandler,
        ISetItemUnitPricesCommandHandler setItemUnitPricesCommandHandler,
        IValidator<SetItemUnitPricesCommand> setItemUnitPricesCommandValidator,
        IInvoiceOrderCommandHandler invoiceOrderCommandHandler,
        IGetAllInvoicedOrdersQueryHandler getAllInvoicedOrdersQueryHandler,
        IGetInvoicedOrderByIdQueryHandler getInvoicedOrderByIdQueryHandler,
        IGetInvoicedOrdersByDateRangeQueryHandler getInvoicedOrdersByDateRangeQueryHandler,
        IValidator<GetInvoicedOrdersByDateRangeQuery> getInvoicedOrdersByDateRangeQueryValidator,
        IValidator<GetInvoicedOrdersByCustomerQuery> getInvoicedOrdersByCustomerQueryValidator,
        IGetInvoicedOrdersByCustomerQueryHandler getInvoicedOrdersByCustomerQueryHandler,
        IUpdateInvoicedItemPriceCommandHandler updateInvoicedItemPriceCommandHandler,
        IValidator<UpdateInvoicedItemPriceCommand> updateInvoicedItemPriceCommandValidator,
        IExportInvoiceDocumentCommandHandler exportInvoiceToPdfCommandHandler
        ) : ControllerBase
    {
        private readonly IExportInvoiceDocumentCommandHandler _exportInvoiceToPdfCommandHandler = exportInvoiceToPdfCommandHandler;
        private readonly IValidator<UpdateInvoicedItemPriceCommand> _updateInvoicedItemPriceCommandValidator = updateInvoicedItemPriceCommandValidator;
        private readonly IUpdateInvoicedItemPriceCommandHandler _updateInvoicedItemPriceCommandHandler = updateInvoicedItemPriceCommandHandler;
        private readonly IValidator<GetInvoicedOrdersByCustomerQuery> _getInvoicedOrdersByCustomerQueryValidator = getInvoicedOrdersByCustomerQueryValidator;
        private readonly IGetInvoicedOrdersByCustomerQueryHandler _getInvoicedOrdersByCustomerQueryHandler = getInvoicedOrdersByCustomerQueryHandler;
        private readonly IValidator<GetInvoicedOrdersByDateRangeQuery> _getInvoicedOrdersByDateRangeQueryValidator = getInvoicedOrdersByDateRangeQueryValidator;
        private readonly IGetInvoicedOrdersByDateRangeQueryHandler _getInvoicedOrdersByDateRangeQueryHandler = getInvoicedOrdersByDateRangeQueryHandler;
        private readonly IGetInvoicedOrderByIdQueryHandler _getInvoicedOrderByIdQueryHandler = getInvoicedOrderByIdQueryHandler;
        private readonly IGetAllInvoicedOrdersQueryHandler _getAllInvoicedOrdersQueryHandler = getAllInvoicedOrdersQueryHandler;
        private readonly IInvoiceOrderCommandHandler _invoiceOrderCommandHandler = invoiceOrderCommandHandler;
        private readonly IValidator<SetItemUnitPricesCommand> _setItemUnitPricesCommandValidator = setItemUnitPricesCommandValidator;
        private readonly ISetItemUnitPricesCommandHandler _setItemUnitPricesCommandHandler = setItemUnitPricesCommandHandler;
        private readonly IGetOrdersPendingBillingQueryHandler _getOrdersPendingBillingQueryHandler = getOrdersPendingBillingQueryHandler;
        private readonly IGetBillingDetailsByOrderIdQueryHandler _getBillingDetailsByOrderIdQueryHandler = getBillingDetailsByOrderIdQueryHandler;


        /// <summary>
        /// Endpoint to get all orders pending billing.
        /// </summary>
        /// <param name="DepotOrderId"></param>
        /// <returns></returns>
        [HttpGet("orders-pending-billing")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> OrderDetails([FromBody] int DepotOrderId)
        {
            var query = new GetBillingDetailsByOrderIdQuery(DepotOrderId);

            var orderDetails = _getBillingDetailsByOrderIdQueryHandler.GetBillingDetailsByOrderIdAsync(query);
            if (orderDetails == null)
            {
                return NotFound($"Order with ID {DepotOrderId} not found.");
            }
            return Ok(await orderDetails);
        }


        /// <summary>
        /// Endpoint to get all orders pending billing.
        /// </summary>
        /// <returns></returns>
        [HttpGet("pending-billing-orders")]
        [ProducesResponseType(typeof(List<DepotOrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> PendingBillingOrders()
        {
            var orders = await _getOrdersPendingBillingQueryHandler.HandleAsync();
            if (orders == null || !orders.Any())
            {
                return NotFound("No pending billing orders found.");
            }
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint for set item unit prices for a depot order.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("set-item-unit-prices")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SetItemUnitPrices([FromBody] SetItemUnitPricesCommand command)
        {
            // Usar el validador inyectado
            var validationResult = await _setItemUnitPricesCommandValidator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            var result = await _setItemUnitPricesCommandHandler.SetItemUnitPriceHandlerAsync(command);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to set item unit prices.");
            }
            return Ok("Item unit prices set successfully.");
        }

        /// <summary>
        /// Endpoint to invoice a depot order by its ID.
        /// </summary>
        /// <param name="depotOrderId"></param>
        /// <returns></returns>
        [HttpPost("invoice-order")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> InvoiceOrder([FromBody] int depotOrderId)
        {
            if (depotOrderId <= 0)
            {
                return BadRequest("Invalid depot order ID.");
            }

            var command = new InvoiceOrderCommand(depotOrderId);

            var result = await _invoiceOrderCommandHandler.HandleAsync(command);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to invoice order.");
            }

            return Ok("Order invoiced successfully.");
        }

        /// <summary>
        /// Endpoint to get all invoiced orders.
        /// </summary>
        /// <returns></returns>
        [HttpGet("all-invoiced-orders")]
        [ProducesResponseType(typeof(List<DepotOrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AllInvoicedOrders()
        {
            var orders = await _getAllInvoicedOrdersQueryHandler.GetAllInvoicedOrdersAsync();
            if (orders == null || !orders.Any())
            {
                return NotFound("No invoiced orders found.");
            }
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint to get an invoiced order by its ID.
        /// </summary>
        /// <param name="billingOrderId"></param>
        /// <returns></returns>
        [HttpGet("invoiced-order-by-id")]
        [ProducesResponseType(typeof(DepotOrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> InvoicedOrderById([FromQuery] int billingOrderId)
        {
            if (billingOrderId <= 0)
            {
                return BadRequest("Invalid billing order ID.");
            }

            // Crea el query manualmente
            var query = new GetInvoicedOrderByIdQuery(billingOrderId);

            var order = await _getInvoicedOrderByIdQueryHandler.GetInvoicedOrderByIdAsync(query);
            if (order == null)
            {
                return NotFound($"Invoiced order with ID {billingOrderId} not found.");
            }
            return Ok(order);
        }


        /// <summary>
        /// Endpoint para obtener órdenes facturadas por rango de fechas.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("invoiced-orders-by-date-range")]
        [ProducesResponseType(typeof(List<DepotOrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> InvoicedOrdersByDateRange([FromBody] GetInvoicedOrdersByDateRangeQuery query)
        {
            var validationResult = _getInvoicedOrdersByDateRangeQueryValidator.Validate(query);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            var orders = await _getInvoicedOrdersByDateRangeQueryHandler.GetInvoicedOrdersByDateRangeAsync(query);
            if (orders == null || !orders.Any())
            {
                return NotFound("No invoiced orders found for the specified date range.");
            }
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para obtener órdenes facturadas por cliente.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("invoiced-orders-by-customer")]
        [ProducesResponseType(typeof(List<DepotOrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> InvoicedOrdersByCustomer([FromQuery] GetInvoicedOrdersByCustomerQuery query)
        {
            var validationResult = _getInvoicedOrdersByCustomerQueryValidator.Validate(query);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            var orders = await _getInvoicedOrdersByCustomerQueryHandler.GetInvoicedOrdersByCustomerAsync(query);
            if (orders == null || !orders.Any())
            {
                return NotFound($"No invoiced orders found for customer with Name {query.CustomerName}.");
            }
            return Ok(orders);
        }


        /// <summary>
        /// Endpoint para actualizar el precio de un ítem facturado en una orden de facturación.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut("update-invoiced-item-price")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> InvoicedItemPrice([FromBody] UpdateInvoicedItemPriceCommand command)
        {
            var validationResult = _updateInvoicedItemPriceCommandValidator.Validate(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            var result = await _updateInvoicedItemPriceCommandHandler.UpdateInvoicedItemPrice(command);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update item price.");
            }
            return Ok("Item price updated successfully.");
        }

        /// <summary>
        /// Endpoint para exportar una factura a PDF / WORD / EXCEL.
        /// </summary>
        /// <param name="billingOrderId"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("export-invoice")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExportInvoiceToPdf(int billingOrderId, [FromQuery] DocumentType type)
        {
            try
            {
                var fileBytes = await _exportInvoiceToPdfCommandHandler.ExportInvoiceHandleAsync(
                    new ExportInvoiceDocumentCommand(billingOrderId, type)
                );

                var fileName = $"Invoice_{billingOrderId}.{DocumentHelper.GetExtension(type)}";
                var contentType = DocumentHelper.GetContentType(type);

                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR en ExportInvoiceToPdf: {ex.GetType().Name} - {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }



    }
}
