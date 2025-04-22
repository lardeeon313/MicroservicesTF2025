using AdminService.Infraestructure.Messaging.Publishers;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly RabbitMQPublisher _publisher;

        public TestController(RabbitMQPublisher publisher)
        {
            _publisher = publisher;
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("pong from [adminService]");
        }

        [HttpPost("publish")]
        public async Task<IActionResult> PublishTestMessage()
        {
            await _publisher.PublishMessageQueue("hello", "Hello from AdminService");
            return Ok("Message published");
        }
    }
}
