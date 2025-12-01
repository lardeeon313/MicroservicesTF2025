using DepotService.Application.DTOs.Pagination;
using DepotService.Application.DTOs.Reports;
using DepotService.Application.Queries.Reports.GetAverageDepotProcessingTime;
using DepotService.Application.Queries.Reports.GetAverageTimePerStatus;
using DepotService.Application.Queries.Reports.GetDepotTeamPerformance;
using DepotService.Application.Queries.Reports.GetOrdersByDeliveryDate;
using DepotService.Application.Queries.Reports.GetOrdersCompleted;
using DepotService.Application.Queries.Reports.GetOrdersInPreparation;
using DepotService.Application.Queries.Reports.GetOrderStatusCount;
using DepotService.Application.Queries.Reports.GetReissuedReportOrders;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure.Documents;
using DepotService.Infraestructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesService.Domain.IRepositories;

namespace DepotService.API.Controllers
{
    [Authorize(Roles = "DepotManager, DepotOperator, BillingManager")]
    [ApiController]
    [Route("api/depotreports")]
    public class DepotReportsController(
        IGetAverageTimePerStatusQueryHandler getAverageTimePerStatusQueryHandler,
        IGetOrderCountPerStatusQueryHandler getOrderCountPerStatusQueryHandler,
        IGetProcessingTimePerOrderQueryHandler getProcessingTimePerOrderQueryHandler,
        IGetDepotTeamPerformanceQueryHandler getDepotTeamPerformanceQueryHandler,
        IGetOrdersByDeliveryDateQueryHandler getOrdersByDeliveryDateQueryHandler,
        IGetReissuedOrdersQueryHandler getReissuedOrdersQueryHandler,
        IGetOrdersCompletedQueryHandler getOrdersCompletedQueryHandler,
        IGetOrdersInPreparationQueryHandler getOrdersInPreparationQueryHandler,
        IDepotOrderRepository getorderRepository,
        IInvoicedOrdersReportPdfGenerator getPdfGenerator,
        IInvoicedOrdersByCustomerPdfGenerator getPdfCustomers
        ) : ControllerBase
    {
        private readonly IGetOrdersInPreparationQueryHandler _getOrdersInPreparationQueryHandler = getOrdersInPreparationQueryHandler;
        private readonly IGetOrdersCompletedQueryHandler _getOrdersCompletedQueryHandler = getOrdersCompletedQueryHandler;
        private readonly IGetReissuedOrdersQueryHandler _getReissuedOrdersQueryHandler = getReissuedOrdersQueryHandler;
        private readonly IGetOrdersByDeliveryDateQueryHandler _getOrdersByDeliveryDateQueryHandler = getOrdersByDeliveryDateQueryHandler;
        private readonly IGetDepotTeamPerformanceQueryHandler _getDepotTeamPerformanceQueryHandler = getDepotTeamPerformanceQueryHandler;
        private readonly IGetProcessingTimePerOrderQueryHandler _getProcessingTimePerOrderQueryHandler = getProcessingTimePerOrderQueryHandler;
        private readonly IGetOrderCountPerStatusQueryHandler _getOrderCountPerStatusQueryHandler = getOrderCountPerStatusQueryHandler;
        private readonly IGetAverageTimePerStatusQueryHandler _getAverageTimePerStatusQueryHandler = getAverageTimePerStatusQueryHandler;
        private readonly IDepotOrderRepository _orderRepository = getorderRepository ;
        private readonly IInvoicedOrdersReportPdfGenerator _pdfGenerator = getPdfGenerator;
        private readonly IInvoicedOrdersByCustomerPdfGenerator _pdfCustomersGenerator = getPdfCustomers;

        /// <summary>
        /// Endpoint para obtener el tiempo promedio por estado de las órdenes.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        [HttpGet("reports/average-time-per-status")]
        [ProducesResponseType(typeof(List<StatusAverageTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAverageTimePerStatus([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = new GetAverageTimePerStatusQuery(from, to);
            var averages = await _getAverageTimePerStatusQueryHandler.GetAverageTimePerStatusAsync(query);
            return Ok(averages);
        }

        /// <summary>
        /// Endpoint para obtener el conteo de órdenes por estado.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        [HttpGet("reports/order-count-per-status")]
        [ProducesResponseType(typeof(List<OrderStatusCountDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderCountPerStatus([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = new GetOrderCountPerStatusQuery(from, to);
            var orderCounts = await _getOrderCountPerStatusQueryHandler.HandleAsync(query);
            return Ok(orderCounts);
        }

        /// <summary>
        /// Endpoint para obtener el tiempo de procesamiento por orden.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="oper"></param>
        /// <param name="customer"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("reports/processing-time-per-order")]
        [ProducesResponseType(typeof(PaginatedResult<OrderProcessingTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProcessingTimePerOrder(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] string? oper,
            [FromQuery] string? customer,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetProcessingTimePerOrderQuery(from, to, oper, customer, page, pageSize);
            var orderProcessingTimes = await _getProcessingTimePerOrderQueryHandler.HandleAsync(query);
            return Ok(orderProcessingTimes);
        }

        /// <summary>
        /// Endpoint para obtener el rendimiento del equipo del depósito.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        [HttpGet("reports/depot-team-performance")]
        [ProducesResponseType(typeof(List<DepotTeamPerformanceDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDepotTeamPerformance([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = new GetDepotTeamPerformanceQuery(from, to);
            var performanceData = await _getDepotTeamPerformanceQueryHandler.HandleAsync(query);
            return Ok(performanceData);
        }

        /// <summary>
        /// Endpoint para obtener las órdenes por fecha de entrega.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        [HttpGet("reports/orders-by-delivery-date")]
        [ProducesResponseType(typeof(List<OrderByDeliveryDateDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByDeliveryDate([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = new GetOrdersByDeliveryDateQuery(from, to);
            var orders = await _getOrdersByDeliveryDateQueryHandler.HandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para obtener las órdenes reemitidas en un rango de fechas.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("reports/reissued-orders")]
        [ProducesResponseType(typeof(PaginatedResult<ReissuedOrderReportDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReissuedOrders(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetReissuedOrdersQuery(from, to, page, pageSize);
            var reissuedOrders = await _getReissuedOrdersQueryHandler.HandleAsync(query);
            return Ok(reissuedOrders);

        }

        /// <summary>
        /// Endpoint para obtener las ordenes completadas en un rango de fechas. 
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("reports/orders-completed")]
        [ProducesResponseType(typeof(PaginatedResult<CompletedOrdersReportDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCompletedOrders(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetOrdersCompletedQuery(from, to, page, pageSize);
            var completedOrders = await _getOrdersCompletedQueryHandler.HandleAsync(query);
            return Ok(completedOrders);
        }

        /// <summary>
        /// Endpoint para obtener las ordenes en preparacion en un rango de fechas.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("reports/orders-in-preparation")]
        [ProducesResponseType(typeof(PaginatedResult<OrdersInPreparationDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersInPreparation(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetOrdersInPreparationQuery(from, to, page, pageSize);
            var completedOrders = await _getOrdersInPreparationQueryHandler.HandleAsync(query);
            return Ok(completedOrders);
        }


        [HttpGet("invoiced-orders/pdf")]
        public async Task<IActionResult> GetInvoicedOrdersReport()
        {
            try
            {
                var orders = await _orderRepository.GetAllInvoicedOrdersAsync();

                if (orders == null || !orders.Any())
                    return BadRequest("No hay órdenes facturadas.");

                var pdfBytes = _pdfGenerator.Generate(orders);

                return File(pdfBytes, "application/pdf", "Reporte_Ordenes_Facturadas.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        //ENDPOINT PARA EXPORTAR EN PDF EL REPORTE DE PEDIDOS FACTURADOS POR CLIENTE: 

        [HttpGet("invoiced-orders/by-customer/pdf")]
        public async Task<IActionResult> GenerateInvoicedOrdersByCustomerPdf([FromQuery] string customerName)
        {
            if (string.IsNullOrWhiteSpace(customerName))
                return BadRequest("Debe especificar el nombre del cliente.");

            // 1. Obtener SOLO pedidos del cliente
            var orders = await _orderRepository.GetInvoicedOrdersByCustomerAsync(customerName);

            if (orders == null || orders.Count == 0)
                return NotFound($"No existen pedidos facturados para el cliente '{customerName}'.");

            // 2. Generar PDF
            var pdf = _pdfCustomersGenerator.Generate(orders);

            // 3. Descargar archivo
            return File(pdf, "application/pdf", $"Pedidos_Facturados_{customerName}.pdf");
        }


    }
}
