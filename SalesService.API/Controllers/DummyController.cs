using Microsoft.AspNetCore.Mvc;
using SalesService.Application.Commands.Handlers.Interfaces;
using SalesService.Application.Commands;
using SalesService.Domain.Entities.DummyEntitie;

namespace SalesService.API.Controllers
{
    [ApiController]
    [Route("api/dummy")]
    public class DummyController(ICreateDummyCommandHandler handler) : ControllerBase
    {
        private readonly ICreateDummyCommandHandler _handler = handler;

        [HttpPost]
        public async Task<ActionResult<Dummy>> Create([FromBody] CreateDummyCommand command)
        {
            var dummy = await _handler.Handle(command);
            return dummy;
        }
    }
}
