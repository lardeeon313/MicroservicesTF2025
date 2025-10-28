using FluentValidation;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryTeams;
using LogisticService.API.RequestDtos.VerificationManager.DeliveryZones;
using LogisticService.API.RequestDtos.VerificationManager.LogisticOrders;
using LogisticService.API.Validators.DeliveryTeams;
using LogisticService.API.Validators.DeliveryZones;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignOperatorToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.AssignZoneToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DeleteDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveOperatorToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.RemoveZoneToTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.AssignOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.CheckCashOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.RemoveAssignOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.SetPriorityOrder;
using LogisticService.Application.Commands.LogisticManager.LogisticOrder.VerifiedOrder;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetAllTeams;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetById;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetAllZones;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetByIdZone;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrders;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetAllOrdersByDeliveryPriority;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetDeliveryIncidentByOrderId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetDRReasonByOrderId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrderById;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByCustomerId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByDeliveryZoneId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByOperatorId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByStatus;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersByTeamId;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetOrdersWithDeliveryIncident;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetPagedOrders;
using LogisticService.Application.Queries.LogisticManager.LogisticOrder.GetRejectionReasonsByOrderId;
using LogisticService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/**************************************************************/
/**************************************************************/
//    CONTROLADOR PARA LOS ENDPOINTS VERIFICATION MANAGER     //
/**************************************************************/
/**************************************************************/
namespace LogisticService.API.Controllers
{
    [Authorize(Roles = "VerificationManager")]
    [ApiController]
    [Route("api/VerificationManager")]
    public class VerificationManagerController(
        ICreateDeliveryTeamCommandHandler createDeliveryTeamCommandHandler,
        IUpdateDeliveryTeamCommandHandler updateDeliveryTeamCommandHandler,
        IDeleteDeliveryTeamCommandHandler deleteDeliveryTeamCommandHandler,
        IDisableDeliveryTeamCommandHandler disableDeliveryTeamCommandHandler,
        IActiveDeliveryTeamCommandHandler activeDeliveryTeamCommandHandler,
        IRemoveZoneFromTeamCommandHandler removeZoneFromTeamCommandHandler,
        IAssignZoneToTeamCommandHandler assignZoneToTeamCommandHandler,
        IGetAllTeamsQueryHandler getAllTeamsQueryHandler,
        IGetTeamByIdQueryHandler getTeamByIdQueryHandler,
        IValidator<CreateDeliveryTeamRequest> createDeliveryTeamRequestValidator,
        IValidator<UpdateDeliveryTeamRequest> updateDeliveryTeamRequestValidator,
        IAssignOperatorToTeamCommandHandler assignOperatorToTeamCommandHandler,
        IRemoveOperatorToTeamCommandHandler removeOperatorToTeamCommandHandler,

        ICreateDeliveryZoneCommandHandler createDeliveryZoneCommandHandler,
        IUpdateDeliveryZoneCommandHandler updateDeliveryZoneCommandHandler,
        IDeleteDeliverZoneCommandHandler deleteDeliverZoneCommandHandler,
        IDisableDeliveryZoneCommandHandler disableDeliveryZoneCommandHandler,
        IActiveDeliveryZoneCommandHandler activeDeliveryZoneCommandHandler,
        IGetAllDeliveryZonesQueryHandler getAllDeliveryZonesQueryHandler,
        IGetDeliveryZoneByIdQueryHandler getDeliveryZoneByIdQueryHandler,
        IValidator<CreateDeliveryZoneRequest> createDeliveryZoneRequestValidator,
        IValidator<UpdateDeliveryZoneRequest> updateDeliveryZoneRequestValidator,

        ICheckCashOrderCommandHandler checkCashOrderCommandHandler,
        IAssignOrderCommandHandler assignOrderCommandHandler,
        IRemoveAssignOrderCommandHandler removeAssignOrderCommandHandler,
        ISetDeliveryPriorityOrderCommandHandler setPriorityOrderCommandHandler,
        IVerifiedOrderCommandHandler verifiedOrderCommandHandler,
        IGetOrdersByDeliveryPriorityQueryHandler getOrdersByDeliveryPriorityQueryHandler,
        IGetAllOrdersQueryHandler getAllOrdersQueryHandler,
        IGetOrderByIdCustomerQueryHandler getOrderByIdCustomerQueryHandler,
        IGetOrderByIdQueryHandler getOrderByIdQueryHandler,
        IGetOrdersByStatusQueryHandler getOrdersByStatusQueryHandler,
        IGetPagedOrdersQueryHandler getPagedOrdersQueryHandler,
        IGetOrdersByDeliveryZoneIdQueryHandler getOrdersByDeliveryZoneIdQueryHandler,
        IGetOrdersByTeamIdQueryHandler getOrdersByTeamIdQueryHandler,
        IGetOrdersByOperatorIdQueryHandler getOrdersByOperatorIdQueryHandler,
        IGetOrdersDeliveryRejectionsQueryHandler getOrdersDeliveryRejectionsQueryHandler,
        IGetOrdersWithDeliveryIncidentQueryHandler getOrdersWithDeliveryIncidentQueryHandler,
        IGetDeliveryIncidentByOrderIdQueryHandler getDeliveryIncidentByOrderIdQueryHandler,
        IGetRejectionReasonsByOrderIdQueryHandler getRejectionReasonsByOrderIdQueryHandler
        ) : ControllerBase
    {
        private readonly IValidator<CreateDeliveryTeamRequest> _createDeliveryTeamRequestValidator = createDeliveryTeamRequestValidator;
        private readonly IValidator<UpdateDeliveryTeamRequest> _updateDeliveryTeamRequestValidator = updateDeliveryTeamRequestValidator;
        private readonly IAssignZoneToTeamCommandHandler _assignZoneToTeamCommandHandler = assignZoneToTeamCommandHandler;
        private readonly IRemoveZoneFromTeamCommandHandler _removeZoneToTeamCommandHandler = removeZoneFromTeamCommandHandler;
        private readonly ICreateDeliveryZoneCommandHandler _createDeliveryZoneCommandHandler = createDeliveryZoneCommandHandler;
        private readonly IUpdateDeliveryZoneCommandHandler _updateDeliveryZoneCommandHandler = updateDeliveryZoneCommandHandler;
        private readonly IDeleteDeliverZoneCommandHandler _deleteDeliveryZoneCommandHandler = deleteDeliverZoneCommandHandler;
        private readonly IActiveDeliveryZoneCommandHandler _activeDeliveryZoneCommandHandler = activeDeliveryZoneCommandHandler;
        private readonly IDisableDeliveryZoneCommandHandler _disableDeliveryZoneCommandHandler = disableDeliveryZoneCommandHandler;
        private readonly IGetAllDeliveryZonesQueryHandler _getAllDeliveryZonesQueryHandler = getAllDeliveryZonesQueryHandler;
        private readonly IGetDeliveryZoneByIdQueryHandler _getDeliveryZoneByIdQueryHandler = getDeliveryZoneByIdQueryHandler;
        private readonly IAssignOperatorToTeamCommandHandler _assignOperatorToTeamCommandHandler = assignOperatorToTeamCommandHandler;
        private readonly IRemoveOperatorToTeamCommandHandler _removeOperatorToTeamCommandHandler = removeOperatorToTeamCommandHandler;

        private readonly IDeleteDeliveryTeamCommandHandler _deleteDeliveryTeamCommandHandler = deleteDeliveryTeamCommandHandler;
        private readonly IGetTeamByIdQueryHandler _getTeamByIdQueryHandler = getTeamByIdQueryHandler;
        private readonly IGetAllTeamsQueryHandler _getAllTeamsQueryHandler = getAllTeamsQueryHandler;
        private readonly IUpdateDeliveryTeamCommandHandler _updateDeliveryTeamCommandHandler = updateDeliveryTeamCommandHandler;
        private readonly ICreateDeliveryTeamCommandHandler _createDeliveryTeamCommandHandler = createDeliveryTeamCommandHandler;
        private readonly IDisableDeliveryTeamCommandHandler _disableDeliveryTeamCommandHandler = disableDeliveryTeamCommandHandler;
        private readonly IActiveDeliveryTeamCommandHandler _activeDeliveryTeamCommandHandler = activeDeliveryTeamCommandHandler;
        private readonly IValidator<CreateDeliveryZoneRequest> _createDeliveryZoneRequestValidator = createDeliveryZoneRequestValidator;
        private readonly IValidator<UpdateDeliveryZoneRequest> _updateDeliveryZoneRequestValidator = updateDeliveryZoneRequestValidator;

        private readonly ICheckCashOrderCommandHandler _checkCashOrderCommandHandler = checkCashOrderCommandHandler;
        private readonly IRemoveAssignOrderCommandHandler _removeAssignOrderCommandHandler = removeAssignOrderCommandHandler;
        private readonly IAssignOrderCommandHandler _assignOrderCommandHandler = assignOrderCommandHandler;
        private readonly ISetDeliveryPriorityOrderCommandHandler _setPriorityOrderCommandHandler = setPriorityOrderCommandHandler;
        private readonly IVerifiedOrderCommandHandler _verifiedOrderCommandHandler = verifiedOrderCommandHandler;
        private readonly IGetOrdersByDeliveryPriorityQueryHandler _getOrdersByDeliveryPriorityQueryHandler = getOrdersByDeliveryPriorityQueryHandler;
        private readonly IGetAllOrdersQueryHandler _getAllOrdersQueryHandler = getAllOrdersQueryHandler;
        private readonly IGetOrderByIdCustomerQueryHandler _getOrderByIdCustomerQueryHandler = getOrderByIdCustomerQueryHandler;
        private readonly IGetOrderByIdQueryHandler _getOrderByIdQueryHandler = getOrderByIdQueryHandler;
        private readonly IGetOrdersByStatusQueryHandler _getOrdersByStatusQueryHandler = getOrdersByStatusQueryHandler;
        private readonly IGetPagedOrdersQueryHandler _getPagedOrdersQueryHandler = getPagedOrdersQueryHandler;
        private readonly IGetOrdersByDeliveryZoneIdQueryHandler _getOrdersByDeliveryZoneIdQueryHandler = getOrdersByDeliveryZoneIdQueryHandler;
        private readonly IGetOrdersByTeamIdQueryHandler _getOrdersByTeamIdQueryHandler = getOrdersByTeamIdQueryHandler;
        private readonly IGetOrdersByOperatorIdQueryHandler _getOrdersByOperatorIdQueryHandler = getOrdersByOperatorIdQueryHandler;
        private readonly IGetOrdersDeliveryRejectionsQueryHandler _getOrdersDeliveryRejectionsQueryHandler = getOrdersDeliveryRejectionsQueryHandler;
        private readonly IGetOrdersWithDeliveryIncidentQueryHandler _getOrdersWithDeliveryIncidentQueryHandler = getOrdersWithDeliveryIncidentQueryHandler;
        private readonly IGetRejectionReasonsByOrderIdQueryHandler _getRejectionReasonsByOrderIdQueryHandler = getRejectionReasonsByOrderIdQueryHandler;
        private readonly IGetDeliveryIncidentByOrderIdQueryHandler _getDeliveryIncidentByOrderIdQueryHandler = getDeliveryIncidentByOrderIdQueryHandler;

        /**************************************************************/
        /**************************************************************/
        /////      CRUD DE EQUIPOS DE REPARTO - DELIVERYTEAMS     //////
        /**************************************************************/
        /**************************************************************/

        /// <summary>
        /// Endpoint para crear un nuevo equipo de entrega.
        /// </summary>
        /// <returns></returns>
        [HttpPost("create-team")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateDeliveryTeam([FromBody] CreateDeliveryTeamRequest request)
        {
            var validationResult = await _createDeliveryTeamRequestValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            try
            {
                var command = new CreateDeliveryTeamCommand(request.TeamName, request.TeamDescription);
                await _createDeliveryTeamCommandHandler.CreateDeliveryTeamAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok(new { message = "Equipo de entrega creado exitosamente." });
        }

        /// <summary>
        /// Endpoint para actualizar equipo 
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="request"></param>        
        /// <returns></returns>
        [HttpPut("update-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateDeliveryTeam(int teamId, [FromBody] UpdateDeliveryTeamRequest request)
        {
            var validationResult = await _updateDeliveryTeamRequestValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            try
            {
                var command = new UpdateDeliveryTeamCommand(teamId, request.TeamName, request.TeamDescription);
                await _updateDeliveryTeamCommandHandler.UpdateDeliveryTeamAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Equipo de entrega actualizado exitosamente." });
        }

        /// <summary>
        /// Endpoint para inhabilitar un equipo
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpPut("disable-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DisableDeliveryTeam(int teamId)
        {
            try
            {
                var command = new DisableDeliveryTeamCommand(teamId);
                await _disableDeliveryTeamCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Equipo de entrega inhabilitado exitosamente." });
        }

        /// <summary>
        /// Endpoint para activar un equipo
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpPut("active-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActiveDeliveryTeam(int teamId)
        {
            try
            {
                var command = new ActiveDeliveryTeamCommand(teamId);
                await _activeDeliveryTeamCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Equipo de entrega habilitado exitosamente." });
        }

        /// <summary>
        /// Endpoint para eliminar un equipo por su ID
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpDelete("delete-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            try
            {
                await _deleteDeliveryTeamCommandHandler.DeleteDeliveryTeamAsync(teamId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Equipo eliminado exitosamente." });

        }

        /// <summary>
        /// Endpoint para retornar una lista de los equipos
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-teams")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams = await _getAllTeamsQueryHandler.HandleAsync();
            return Ok(teams);
        }

        /// <summary>
        /// Endpoint para retornar un equipo por su ID
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpGet("get-team-by-id/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTeamById(int teamId)
        {
            var team = await _getTeamByIdQueryHandler.GetDeliveryTeam(teamId);
            return team is not null ? Ok(team) : NotFound(new { message = "Team not found." });
        }


        /// <summary>
        /// Asigna un operador a un equipo
        /// </summary>
        /// <param name="teamId">ID de la orden</param>
        /// <param name="request">Datos del operador</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Asignación exitosa</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404">Orden no encontrada</response>
        [HttpPost("{teamId}/assign-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]

        public async Task<IActionResult> AssignOperatorToTeam(int teamId, [FromBody] AssignOperatorToTeamRequest request)
        {
            var command = new AssignOperatorToTeamCommand(request.OperatorUserId, teamId);

            var result = await _assignOperatorToTeamCommandHandler.AssignOperatorAsync(command);

            if (!result)
                return BadRequest("No se pudo asignar el operador.");

            return Ok("Operador asignado correctamente.");
        }

        /// <summary>
        /// Remover un operador de un equipo 
        /// </summary>
        /// <param name="teamId"></param>
        /// <param name="operatorUserId"></param>
        /// <returns></returns>
        [HttpDelete("{teamId}/remove-operator/{operatorUserId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveOperator(int teamId, Guid operatorUserId)
        {
            var command = new RemoveOperatorToTeamCommand(operatorUserId, teamId);
            var result = await _removeOperatorToTeamCommandHandler.RemoveOperatorAsync(command);
            if (!result)
                return BadRequest("No se pudo remover el operador.");

            return Ok("Operador removido correctamente.");
        }

        /// <summary>
        /// Asigna una zona a un equipo
        /// </summary>
        /// <param name="teamId">ID de la orden</param>
        /// <param name="request">Datos del operador</param>
        /// <returns>200 OK</returns>
        /// <response code="200">Asignación exitosa</response>
        /// <response code="400">Datos inválidos</response>
        /// <response code="404">Orden no encontrada</response>
        [HttpPost("{teamId}/assign-zone")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]

        public async Task<IActionResult> AssignZoneToTeam(int teamId, [FromBody] AssignZoneToTeamRequest request)
        {
            var command = new AssignZoneToTeamCommand(request.ZoneId, teamId);

            var result = await _assignZoneToTeamCommandHandler.AssignZoneToTeam(command);

            if (!result)
                return BadRequest("No se pudo asignar la zona.");

            return Ok("Zona asignada correctamente.");
        }

        /// <summary>
        /// Remover una zona de un equipo 
        /// </summary>
        /// <param name="zoneId"></param>
        /// <param name="teamId"></param>        
        /// <returns></returns>
        [HttpDelete("{teamId}/remove-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveZoneFromTeam(int zoneId, int teamId)
        {
            var command = new RemoveZoneFromTeamCommand(zoneId, teamId);
            var result = await _removeZoneToTeamCommandHandler.RemoveZoneAsync(command);
            if (!result)
                return BadRequest("No se pudo remover la zona.");

            return Ok("Zona removido correctamente.");
        }

        /// <summary>
        /// Endpoint para asignar un operador a un equipo
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("AssignOperatorToTeam")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignOperatorToTeam([FromBody] AssignOperatorToTeamRequest request)
        {
            var command = new AssignOperatorToTeamCommand(request.OperatorUserId, request.TeamId);
            var result = await _assignOperatorToTeamCommandHandler.AssignOperatorAsync(command);
            if (!result)
                return BadRequest("No se pudo asignar el operador.");
            return Ok("Operador asignado correctamente.");
        }

        /// <summary>
        /// Endpoint para remover un operador de un equipo
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("RemoveOperatorFromTeam")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveOperatorFromTeam([FromBody] RemoveOperatorToTeamRequest request)
        {
            var command = new RemoveOperatorToTeamCommand(request.OperatorUserId, request.TeamId);
            var result = await _removeOperatorToTeamCommandHandler.RemoveOperatorAsync(command);
            if (!result)
                return BadRequest("No se pudo asignar el operador.");
            return Ok("Operador asignado correctamente.");
        }

        /**************************************************************/
        /**************************************************************/
        /////      CRUD DE ZONAS DE REPARTO - DELIVERYTEAMS       //////
        /**************************************************************/
        /**************************************************************/


        /// <summary>
        /// Endpoint para crear una nueva zona de entrega.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("create-zone")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateDeliveryZone([FromBody] CreateDeliveryZoneRequest request)
        {
            var validationResult = await _createDeliveryZoneRequestValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            try
            {
                var command = new CreateDeliveryZoneCommand(request.ZoneName, request.ZoneDescription);
                await _createDeliveryZoneCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok(new { message = "Zona de entrega creado exitosamente." });
        }

        /// <summary>
        /// Endpoint para actualizar una zona
        /// </summary>
        /// <param name="zoneId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("update-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateDeliveryZone(int zoneId, [FromBody] UpdateDeliveryZoneRequest request)
        {
            var validationResult = await _updateDeliveryZoneRequestValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(validationResult.ToDictionary()));
            }

            try
            {
                var command = new UpdateDeliveryZoneCommand(zoneId, request.ZoneName, request.ZoneDescription);
                await _updateDeliveryZoneCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Zona actualizada exitosamente." });
        }

        /// <summary>
        /// Endpoint para inhabilitar una zona
        /// </summary>
        /// <param name="zoneId"></param>
        /// <returns></returns>
        [HttpPut("disable-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DisableDeliveryZone(int zoneId)
        {
            try
            {
                var command = new DisableDeliveryZoneCommand(zoneId);
                await _disableDeliveryZoneCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Zona inhabilitada exitosamente." });
        }

        /// <summary>
        /// Endpoint para activar una zona
        /// </summary>
        /// <param name="zoneId"></param>
        /// <returns></returns>
        [HttpPut("active-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActiveDeliveryZone(int zoneId)
        {
            try
            {
                var command = new ActiveDeliveryZoneCommand(zoneId);
                await _activeDeliveryZoneCommandHandler.HandleAsync(command);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Zona habilitada exitosamente." });
        }

        /// <summary>
        /// Endpoint para eliminar una zone por su ID
        /// </summary>
        /// <param name="zoneId"></param>
        /// <returns></returns>
        [HttpDelete("delete-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteZone(int zoneId)
        {
            var command = new DeleteDeliveryZoneCommand(zoneId);
            await _deleteDeliveryZoneCommandHandler.HandleAsync(command);
            return Ok(new { message = "Zona eliminada exitosamente." });
        }

        /// <summary>
        /// Endpoint para retornar una lista de las zonas de reparto
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-zones")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllZones()
        {
            var zones = await _getAllDeliveryZonesQueryHandler.HandleAsync();
            return Ok(zones);
        }

        /// <summary>
        /// Endpoint para retornar una zona por su ID
        /// </summary>
        /// <param name="zoneId"></param>
        /// <returns></returns>
        [HttpGet("get-zone-by-id/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetZoneById(int zoneId)
        {
            var zone = await _getDeliveryZoneByIdQueryHandler.HandleAsync(zoneId);
            return zone is not null ? Ok(zone) : NotFound(new { message = "Zone not found." });
        }

        /**************************************************************/
        /**************************************************************/
        /////          ENDPOINTS DE ORDENES LOGISTICAS             /////
        /*************************************************************/
        /**************************************************************/

        /// <summary>
        /// Endpoint para asignar un operador a una orden logística
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("assign-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AssignOperator([FromBody] AssignOperatorRequest request)
        {
            var command = new AssignOrderCommand(request.LogisticOrderId, request.OperatorUserId);
            var result = await _assignOrderCommandHandler.HandleAsync(command);
            if (!result)
                return BadRequest("No se pudo asignar el operador.");
            return Ok("Operador asignado correctamente.");
        }

        [HttpPost("remove-operator")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveOperator([FromBody] RemoveAssignOperatorRequest request)
        {
            var command = new RemoveAssignOrderCommand(request.LogisticOrderId, request.OperatorUserId);
            var result = await _removeAssignOrderCommandHandler.RemoveAssignOrder(command);
            if (!result)
                return BadRequest("No se pudo remover el operador.");
            return Ok("Operador removido correctamente.");
        }

        /// <summary>
        /// Endpoint para establecer la prioridad de una orden logística
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("set-priority")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SetPriority([FromBody] SetPriorityRequest request)
        {
            var command = new SetDeliveryPriorityOrderCommand(request.LogisticOrderId, request.DeliveryPriority);
            var result = await _setPriorityOrderCommandHandler.SetPriorityHandleAsync(command);

            if (!result)
                return BadRequest("No se pudo establecer la prioridad.");

            return Ok("Prioridad establecida correctamente.");
        }

        /// <summary>
        /// Endpoint para verificar una orden logística
        /// </summary>
        /// <param name="logisticOrderId"></param>
        /// <returns></returns>
        [HttpPost("verify-order/{logisticOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> VerifyOrder(int logisticOrderId)
        {
            var command = new VerifiedOrderCommand(logisticOrderId);
            var result = await _verifiedOrderCommandHandler.VerifiedOrderHandleAsync(command);
            if (!result)
                return BadRequest("No se pudo verificar la orden.");
            return Ok("Orden verificada correctamente.");
        }

        /// <summary>
        /// Endpoint para verificar una orden logística de tipo Cash
        /// </summary>
        /// <param name="logisticOrderId"></param>
        /// <returns></returns>
        [HttpPost("check-cash-order/{logisticOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckCashOrder(int logisticOrderId)
        {
            var command = new CheckCashOrderCommand(logisticOrderId);
            var result = await _checkCashOrderCommandHandler.CheckCashHandleAsync(command);
            if (!result)
                return BadRequest("No se pudo verificar la orden con pago en efectivo.");
            return Ok("Orden con pago en efectivo verificada correctamente.");
        }

        /// <summary>
        /// Endpoint para retornar una lista de ordenes en base a su prioridad de entrega
        /// </summary>
        /// <param name="deliveryPriority"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-priority/{deliveryPriority}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByDeliveryPriority(DeliveryPriority deliveryPriority)
        {
            var query = new GetOrdersByDeliveryPriorityQuery(deliveryPriority);
            var orders = await _getOrdersByDeliveryPriorityQueryHandler.GetOrdersByDeliveryPriorityAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una lista de todas las órdenes logísticas
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-all-orders")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _getAllOrdersQueryHandler.GetAllHandleAsync();
            return Ok(orders);
        }

        /// <summary>
        /// endpoint para retornar una orden logística por su ID
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-customer/{customerId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByCustomerId(Guid customerId)
        {
            var query = new GetOrderByIdCustomerQuery(customerId);
            var orders = await _getOrderByIdCustomerQueryHandler.HandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una orden logística por su ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("get-order-by-id/{id}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var query = new GetOrderByIdQuery(id);
            var order = await _getOrderByIdQueryHandler.GetOrderByIdHandleAsync(query);
            return Ok(order);
        }

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
        /// Endpoint para retornar una lista paginada de órdenes logísticas
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpGet("get-paged-orders")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPagedOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
        {
            var query = new GetPagedOrdersQuery(pageNumber, pageSize);
            var result = await _getPagedOrdersQueryHandler.Handle(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Endpoint para retornar una lista de órdenes logísticas asignadas a un equipo de reparto específico
        /// </summary>
        /// <param name="zoneId"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-delivery-zone/{zoneId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByDeliveryZoneId(int zoneId)
        {
            var query = new GetOrdersByDeliveryZoneIdQuery(zoneId);
            var orders = await _getOrdersByDeliveryZoneIdQueryHandler.HandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una lista de órdenes logísticas asignadas a un equipo de reparto específico
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-team/{teamId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByTeamId(int teamId)
        {
            var query = new GetOrdersByTeamIdQuery(teamId);
            var orders = await _getOrdersByTeamIdQueryHandler.HandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una lista de órdenes logísticas asignadas a un operador específico
        /// </summary>
        /// <param name="operatorUserId"></param>
        /// <returns></returns>
        [HttpGet("get-orders-by-operator/{operatorUserId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersByOperatorId(Guid operatorUserId)
        {
            var query = new GetOrdersByOperatorIdQuery(operatorUserId);
            var orders = await _getOrdersByOperatorIdQueryHandler.HandleAsync(query);
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una lista de órdenes logísticas con rechazos de entrega
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-orders-with-delivery-rejections")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersWithDeliveryRejections()
        {
            var orders = await _getOrdersDeliveryRejectionsQueryHandler.GetOrdersDeliveryRejectionsAsync();
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar una lista de órdenes logísticas con incidentes de entrega
        /// </summary>
        /// <returns></returns>
        [HttpGet("get-orders-with-delivery-incidents")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrdersWithDeliveryIncidents()
        {
            var orders = await _getOrdersWithDeliveryIncidentQueryHandler.GetOrdersWithDeliveryIncidentAsync();
            return Ok(orders);
        }

        /// <summary>
        /// Endpoint para retornar todos los incidentes que tuvo una order por su Id
        /// </summary>
        /// <param name="logisticOrderId"></param>
        /// <returns></returns>
        [HttpGet("get-delivery-incidents-by-order-id/{logisticOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDeliveryIncidentsByOrderId(int logisticOrderId)
        {
            var query = new GetDeliveryIncidentByOrderIdQuery(logisticOrderId);
            var orders = await _getDeliveryIncidentByOrderIdQueryHandler.GetDeliveryIncidentByOrderIdAsync(query);
            return Ok(orders);
        }


        /// <summary>
        /// Endpoint para retornar todos los rechazos de asignacion que tuvo una order por su Id
        /// </summary>
        /// <param name="logisticOrderId"></param>
        /// <returns></returns>
        [HttpGet("get-rejection-reasons-by-order-id/{logisticOrderId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetRejectionReasonsByOrderId(int logisticOrderId)
        {
            var query = new GetRejectionReasonsByOrderIdQuery(logisticOrderId);
            var orders = await _getRejectionReasonsByOrderIdQueryHandler.GetRejectionReasonsByOrderIdAsync(query);
            return Ok(orders);
        }
    }
}