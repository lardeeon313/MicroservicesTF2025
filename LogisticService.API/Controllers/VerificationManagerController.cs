using FluentValidation;
using LogisticService.API.RequestDtos.DeliveryTeams;
using LogisticService.API.RequestDtos.DeliveryZones;
using LogisticService.API.Validators.DeliveryTeams;
using LogisticService.API.Validators.DeliveryZones;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.ActiveDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.CreateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DeleteDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.DisableDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryTeam.UpdateDeliveryTeam;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.ActiveDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.CreateDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DeleteDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.DisableDeliveryZone;
using LogisticService.Application.Commands.LogisticManager.DeliveryZone.UpdateDeliveryZone;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetAllTeams;
using LogisticService.Application.Queries.LogisticManager.DeliveryTeam.GetById;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetAllZones;
using LogisticService.Application.Queries.LogisticManager.DeliveryZone.GetByIdZone;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/**************************************************************/
/**************************************************************/
///  CONTROLADOR PARA MANEJAR LOS CRUDS DE LOGISTIC SERVICE  ///
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
        IGetAllTeamsQueryHandler getAllTeamsQueryHandler,
        IGetTeamByIdQueryHandler getTeamByIdQueryHandler,
        IValidator<CreateDeliveryTeamRequest> createDeliveryTeamRequestValidator,
        IValidator<UpdateDeliveryTeamRequest> updateDeliveryTeamRequestValidator,

        ICreateDeliveryZoneCommandHandler createDeliveryZoneCommandHandler,
        IUpdateDeliveryZoneCommandHandler updateDeliveryZoneCommandHandler,
        IDeleteDeliverZoneCommandHandler deleteDeliverZoneCommandHandler,
        IDisableDeliveryZoneCommandHandler disableDeliveryZoneCommandHandler,
        IActiveDeliveryZoneCommandHandler activeDeliveryZoneCommandHandler,
        IGetAllDeliveryZonesQueryHandler getAllDeliveryZonesQueryHandler,
        IGetDeliveryZoneByIdQueryHandler getDeliveryZoneByIdQueryHandler,
        IValidator<CreateDeliveryZoneRequest> createDeliveryZoneRequestValidator,
        IValidator<UpdateDeliveryZoneRequest> updateDeliveryZoneRequestValidator
        ) : ControllerBase
    {
        private readonly IValidator<CreateDeliveryTeamRequest> _createDeliveryTeamRequestValidator = createDeliveryTeamRequestValidator;
        private readonly IValidator<UpdateDeliveryTeamRequest> _updateDeliveryTeamRequestValidator = updateDeliveryTeamRequestValidator;
        private readonly ICreateDeliveryZoneCommandHandler _createDeliveryZoneCommandHandler = createDeliveryZoneCommandHandler;
        private readonly IUpdateDeliveryZoneCommandHandler _updateDeliveryZoneCommandHandler = updateDeliveryZoneCommandHandler;
        private readonly IDeleteDeliverZoneCommandHandler _deleteDeliveryZoneCommandHandler = deleteDeliverZoneCommandHandler;
        private readonly IActiveDeliveryZoneCommandHandler _activeDeliveryZoneCommandHandler = activeDeliveryZoneCommandHandler;
        private readonly IDisableDeliveryZoneCommandHandler _disableDeliveryZoneCommandHandler = disableDeliveryZoneCommandHandler;
        private readonly IGetAllDeliveryZonesQueryHandler _getAllDeliveryZonesQueryHandler = getAllDeliveryZonesQueryHandler;
        private readonly IGetDeliveryZoneByIdQueryHandler _getDeliveryZoneByIdQueryHandler = getDeliveryZoneByIdQueryHandler;

        private readonly IDeleteDeliveryTeamCommandHandler _deleteDeliveryTeamCommandHandler = deleteDeliveryTeamCommandHandler;
        private readonly IGetTeamByIdQueryHandler _getTeamByIdQueryHandler = getTeamByIdQueryHandler;
        private readonly IGetAllTeamsQueryHandler _getAllTeamsQueryHandler = getAllTeamsQueryHandler;
        private readonly IUpdateDeliveryTeamCommandHandler _updateDeliveryTeamCommandHandler = updateDeliveryTeamCommandHandler;
        private readonly ICreateDeliveryTeamCommandHandler _createDeliveryTeamCommandHandler = createDeliveryTeamCommandHandler;
        private readonly IDisableDeliveryTeamCommandHandler _disableDeliveryTeamCommandHandler = disableDeliveryTeamCommandHandler;
        private readonly IActiveDeliveryTeamCommandHandler _activeDeliveryTeamCommandHandler = activeDeliveryTeamCommandHandler;
        private readonly IValidator<CreateDeliveryZoneRequest> _createDeliveryZoneRequestValidator = createDeliveryZoneRequestValidator;
        private readonly IValidator<UpdateDeliveryZoneRequest> _updateDeliveryZoneRequestValidator = updateDeliveryZoneRequestValidator;

        //// CRUD DELIVERY TEAMS ////

        /// <summary>
        /// Endpoint para crear un nuevo equipo de entrega.
        /// </summary>
        /// <param name="TeamName"></param>
        /// <param name="TeamDescription"></param>
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
        /// <param name="TeamName"></param>
        /// <param name="TeamDescription"></param>
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

        //// CRUD DELIVERY ZONES ////
        



        /// <summary>
        /// Endpoint para crear una nueva zona de entrega.
        /// </summary>
        /// <param name="ZoneName"></param>
        /// <param name="ZoneDescription"></param>
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
        /// <param name="ZoneName"></param>
        /// <param name="ZoneDescription"></param>
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

    }
}
