using Microsoft.AspNetCore.Mvc;

namespace ApiGateway.Controllers
{
    public class healthController : ControllerBase
    {
        [ApiController]
        [Route("health")]
        public class HealthController : ControllerBase
        {
            [HttpGet]
            public IActionResult Get() => Ok("API Gateway healthy");
        }
    }
}
