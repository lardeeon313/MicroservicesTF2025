using LogisticService.API.RequestDtos.Reports;
using LogisticService.Application.DTOs.LogisticReportDtos;
using LogisticService.Application.Queries.LogisticReports.GetCustomersWithMostIncidentsReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryIncidentReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryRejectionsReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryTeamActivityReport;
using LogisticService.Application.Queries.LogisticReports.GetDeliveryTimeReport;
using LogisticService.Application.Queries.LogisticReports.GetOperatorProductivityReport;
using LogisticService.Application.Queries.LogisticReports.GetOrdersByStatusReport;
using LogisticService.Application.Queries.LogisticReports.GetOrderStatusHistoryReport;
using LogisticService.Application.Queries.LogisticReports.GetPendingCashVerificationReport;
using LogisticService.Application.Queries.LogisticReports.GetZonePerformanceReport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace LogisticService.API.Controllers
{
    [Authorize(Roles = "VerificationManager")]
    [ApiController]
    [Route("api/LogisticReport")]
    public class LogisticReportController(
        IGetCustomersWithMostIncidentsReportQueryHandler getCustomersWithMostIncidentsReportQueryHandler,
        IGetDeliveryIncidentReportQueryHandler getDeliveryIncidentReportQueryHandler,
        IGetDeliveryRejectionsReportQueryHandler getDeliveryRejectionsReportQueryHandler,
        IGetDeliveryTeamActivityReportQueryHandler getDeliveryTeamActivityReportQueryHandler,
        IGetDeliveryTimeReportQueryHandler getDeliveryTimeReportQueryHandler,
        IGetOperatorProductivityReportQueryHandler getOperatorProductivityReportQueryHandler,
        IGetOrdersByStatusReportQueryHandler getOrdersByStatusReportQueryHandler,
        IGetOrderStatusHistoryReportQueryHandler getOrderStatusHistoryReportQueryHandler,
        IGetPendingCashVerificationReportQueryHandler getPendingCashVerificationReportQueryHandler,
        IGetZonePerformanceReportQueryHandler getZonePerformanceReportQueryHandler
        ) : ControllerBase
    {
        private readonly IGetCustomersWithMostIncidentsReportQueryHandler _getCustomersWithMostIncidentsReportQueryHandler = getCustomersWithMostIncidentsReportQueryHandler;
        private readonly IGetDeliveryIncidentReportQueryHandler _getDeliveryIncidentReportQueryHandler = getDeliveryIncidentReportQueryHandler;
        private readonly IGetDeliveryRejectionsReportQueryHandler _getDeliveryRejectionsReportQueryHandler = getDeliveryRejectionsReportQueryHandler;
        private readonly IGetDeliveryTeamActivityReportQueryHandler _getDeliveryTeamActivityReportQueryHandler = getDeliveryTeamActivityReportQueryHandler;
        private readonly IGetDeliveryTimeReportQueryHandler _getDeliveryTimeReportQueryHandler = getDeliveryTimeReportQueryHandler;
        private readonly IGetOperatorProductivityReportQueryHandler _getOperatorProductivityReportQueryHandler = getOperatorProductivityReportQueryHandler;
        private readonly IGetOrdersByStatusReportQueryHandler _getOrdersByStatusReportQueryHandler = getOrdersByStatusReportQueryHandler;
        private readonly IGetOrderStatusHistoryReportQueryHandler _getOrderStatusHistoryReportQueryHandler = getOrderStatusHistoryReportQueryHandler;
        private readonly IGetPendingCashVerificationReportQueryHandler _getPendingCashVerificationReportQueryHandler = getPendingCashVerificationReportQueryHandler;
        private readonly IGetZonePerformanceReportQueryHandler _getZonePerformanceReportQueryHandler = getZonePerformanceReportQueryHandler;
        
        /// <summary>
        /// Clientes con mayor incidencia
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("customers-with-incidents")]
        [ProducesResponseType(typeof(IEnumerable<CustomerIncidentReportDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCustomersWithIncidentsReport([FromQuery] GetCustomersWithMostIncidentsReportRequest request)
        {
            var query = new GetCustomersWithMostIncidentsReportQuery(request.StartDate, request.EndDate, request.CustomerId, request.IncidentType);
            var result = await _getCustomersWithMostIncidentsReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Incidencias en entrega
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("delivery-incidents")]
        [ProducesResponseType(typeof(IEnumerable<DeliveryIncidentReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDeliveryIncidentsReport([FromQuery] GetDeliveryIncidentReportRequest request)
        {
            var query = new GetDeliveryIncidentReportQuery(request.StartDate, request.EndDate, request.OperatorId, request.DeliveryZoneId, request.DeliveryTeamId);
            var result = await _getDeliveryIncidentReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Rechazos de entrega
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("delivery-rejections")]
        [ProducesResponseType(typeof(IEnumerable<DeliveryRejectionReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDeliveryRejectionsReport([FromQuery] GetDeliveryRejectionsReportRequest request)
        {
            var query = new GetDeliveryRejectionsReportQuery(request.StartDate, request.EndDate, request.OperatorId, request.DeliveryZoneId);
            var result = await _getDeliveryRejectionsReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Actividad por equipo
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("delivery-team-activity")]
        [ProducesResponseType(typeof(IEnumerable<TeamActivityReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDeliveryTeamActivityReport([FromQuery] GetDeliveryTeamActivityReportRequest request)
        {
            var query = new GetDeliveryTeamActivityReportQuery(request.StartDate, request.EndDate, request.DeliveryTeamId);
            var result = await _getDeliveryTeamActivityReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Tiempos de entrega
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("delivery-times")]
        [ProducesResponseType(typeof(IEnumerable<DeliveryTimeReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDeliveryTimesReport([FromQuery] GetDeliveryTimeReportRequest request)
        {
            var query = new GetDeliveryTimeReportQuery(request.StartDate, request.EndDate, request.DeliveryZoneId, request.DeliveryTeamId);
            var result = await _getDeliveryTimeReportQueryHandler.GetDeliveryTimeReportAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Productividad por operador
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("operator-productivity")]
        [ProducesResponseType(typeof(IEnumerable<OperatorProductivityReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOperatorProductivityReport([FromQuery] GetOperatorProductivityReportRequest request)
        {
            var query = new GetOperatorProductivityReportQuery(request.StartDate, request.EndDate, request.DeliveryZoneId, request.DeliveryTeamId, request.PaymentType);
            var result = await _getOperatorProductivityReportQueryHandler.IGetOperatorProductivityReportAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Pedidos por estado
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("orders-by-status")]
        [ProducesResponseType(typeof(IEnumerable<OrdersByStatusReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrdersByStatusReport([FromQuery] GetOrdersByStatusReportRequest request)
        {
            var query = new GetOrdersByStatusReportQuery(request.StartDate, request.EndDate, request.DeliveryZoneId, request.DeliveryTeamId, request.PaymentType, request.OperatorId);
            var result = await _getOrdersByStatusReportQueryHandler.ordersByStatusReportDtos(query);
            return Ok(result);
        }

        /// <summary>
        /// Flujo de estados (histórico)
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("order-status-history")]
        [ProducesResponseType(typeof(IEnumerable<OrderStatusHistoryReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrderStatusHistoryReport([FromQuery] GetOrderStatusHistoryReportRequest request)
        {
            var query = new GetOrderStatusHistoryReportQuery(request.StartDate, request.EndDate, request.OperatorId, request.OldStatus, request.NewStatus, request.OperatorId);
            var result = await _getOrderStatusHistoryReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Efectivo pendiente de verificación
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("pending-cash-verification")]
        [ProducesResponseType(typeof(IEnumerable<PendingCashVerificationReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPendingCashVerificationReport([FromQuery] GetPendingCashVerificationReportRequest request)
        {
            var query = new GetPendingCashVerificationReportQuery
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                OperatorId = request.OperatorId,
                DeliveryTeamId = request.DeliveryTeamId
            };
            var result = await _getPendingCashVerificationReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
        
        /// <summary>
        /// Eficiencia por zona
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("zone-performance")]
        [ProducesResponseType(typeof(IEnumerable<ZonePerformanceReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetZonePerformanceReport([FromQuery] GetZonePerformanceReportRequest request)
        {
            var query = new GetZonePerformanceReportQuery(request.StartDate, request.EndDate, request.DeliveryTeamId, request.OperatorId);
            var result = await _getZonePerformanceReportQueryHandler.HandleAsync(query);
            return Ok(result);
        }
    } 
}
    

