using Microsoft.AspNetCore.Mvc;
using SalesService.Application.Commands;
using SalesService.Application.Handlers;
using SalesService.Application.Queries;

namespace SalesService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly RegisterCustomerHandler _registerHandler;
        private readonly GetCustomerByEmailHandler _getByEmailHandler;

        public CustomerController(
            RegisterCustomerHandler registerHandler,
            GetCustomerByEmailHandler getByEmailHandler)
        {
            _registerHandler = registerHandler;
            _getByEmailHandler = getByEmailHandler;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCustomerCommand cmd)
        {
            var id = await _registerHandler.HandleAsync(cmd);
            return Ok(new { CustomerId = id });
        }

        [HttpGet("by-email")]
        public async Task<IActionResult> ByEmail([FromQuery] string email)
        {
            var customer = await _getByEmailHandler.HandleAsync(new GetCustomerByEmailQuery { Email = email });
            return customer == null ? NotFound() : Ok(customer);
        }
    }
}

