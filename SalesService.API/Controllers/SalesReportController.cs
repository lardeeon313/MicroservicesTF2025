using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesService.API.RequestDtos.Reports;
using SalesService.Application.DTOs.Order;
using SalesService.Application.Queries.Customers.GetCustomerById;
using SalesService.Application.Queries.Reports.CustomerInactiveReport;
using SalesService.Application.Queries.Reports.CustomerPaymenTypeReport;
using SalesService.Application.Queries.Reports.CustomerReport;
using SalesService.Application.Queries.Reports.CustomerSatisfactionReport;
using SalesService.Application.Queries.Reports.GetSalesPerfomanceReport;
using SalesService.Application.Queries.Reports.ModifiedCanceledOrders;
using SalesService.Domain.Enums;
using SalesService.Domain.Helper;

namespace SalesService.API.Controllers
{
    [Authorize(Roles = "SalesStaff, Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesReportController(
        IGetCustomerReportQueryHandler getCustomerReportQueryHandler,
        IGetCustomerSatisfactionQueryHandler getCustomerSatisfactionQueryHandler,
        IGetCustomerInactiveQueryHandler getCustomerInactiveQueryHandler,
        IGetModifiedCanceledOrdersQueryHandler getModifiedCanceledOrdersQueryHandler,
        IGetSalesPerfomanceReportQueryHandler getSalesPerfomanceReportQueryHandler,
        IGetCustomerPaymentTypeQueryHandler getCustomerPaymentTypeQueryHandler
        ) : ControllerBase
    {
        private readonly IGetSalesPerfomanceReportQueryHandler _getSalesPerfomanceReportQueryHandler = getSalesPerfomanceReportQueryHandler;
        private readonly IGetModifiedCanceledOrdersQueryHandler _getModifiedCanceledOrdersQueryHandler = getModifiedCanceledOrdersQueryHandler; 
        private readonly IGetCustomerInactiveQueryHandler _getCustomerInactiveQueryHandler = getCustomerInactiveQueryHandler;
        private readonly IGetCustomerReportQueryHandler _getCustomerReportQueryHandler = getCustomerReportQueryHandler;
        private readonly IGetCustomerSatisfactionQueryHandler _getCustomerSatisfactionQueryHandler = getCustomerSatisfactionQueryHandler;
        private readonly IGetCustomerPaymentTypeQueryHandler _getCustomerPaymentTypeQueryHandler = getCustomerPaymentTypeQueryHandler;

        /// <summary>
        /// Endpoint para obtener el reporte de clientes con filtros y paginacion
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("reports-customers")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReportCustomers([FromBody] GetCustomerReportRequest request)
        {
            var query = new GetCustomerReportQuery(
                request.Name,
                request.Email,
                request.MinOrders,
                request.Page,
                request.PageSize
            );

            var result = await _getCustomerReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener el reporte de satisfaccion del cliente con filtros y paginacion
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("reports-satisfaction-customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetReportSatisfactionCustomer([FromBody] GetCustomerSatisfactionReportRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!string.IsNullOrWhiteSpace(request.Level) && !Enum.TryParse<SatisfactionLevel>(request.Level, ignoreCase: true, out _))
            {
                return BadRequest($"El valor '{request.Level}' no es un nivel de satisfacción válido.");
            }

            var query = new GetCustomerSatisfactionQuery(
                request.Name,
                request.Email,
                request.Level,   
                request.Page,
                request.PageSize
            );

            var result = await _getCustomerSatisfactionQueryHandler.HandleAsync(query);
            return Ok(result);
        }



        /// <summary>
        /// Endpoint para obtener el reporte de clientes inactivos con filtros y paginacion
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("reports-customer-status")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReportCustomerStatus([FromBody] GetCustomerInactiveReportRequest request)
        {
            var query = new GetCustomerInactiveQuery(
                request.Name,
                request.Email,
                request.Status,
                request.Page,
                request.PageSize);

            var result = await _getCustomerInactiveQueryHandler.HandleAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener el estado de los clientes. 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("reports-orders-modified-canceled")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCustomerStatus([FromQuery] GetModifiedCanceledOrderRequest request)
        {
            var query = new GetModifiedCanceledOrdersQuery(
                request.CustomerName,
                request.DateFrom,
                request.DateTo,
                request.Status,
                request.Page,
                request.PageSize
            );

            var result = await _getModifiedCanceledOrdersQueryHandler.HandleAsync(query);
            return Ok(result);
        }


        /// <summary>
        /// Endpoint para obtener el reporte de desempeño de ventas
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="range"></param>
        /// <returns></returns>
        [HttpGet("report-performance")]
        [ProducesResponseType(typeof(IEnumerable<SalesPerfomanceDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSalesPerformanceReport([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] SalesRangeReport range = SalesRangeReport.All)
        {
            var query = new GetSalesPerformanceReportQuery(from, to, range);

            var result = await _getSalesPerfomanceReportQueryHandler.Handle(query);
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para obtener el reporte de tipos de pago por cliente
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("report-customer-paymenttypes")]
        [ProducesResponseType(typeof(IEnumerable<SalesPerfomanceDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCustomerPaymentTypes([FromBody] CustomerPaymentTypeReportRequest request)
        {
            var query = new GetCustomerPaymentTypeQuery(
                request.Name,
                request.PaymentTypes,
                request.From,
                request.To,
                request.Page,
                request.PageSize);

            var result = await _getCustomerPaymentTypeQueryHandler.GetCustomerPaymentTypeReportAsync(query);
            return Ok(result);
        }









    }
}
