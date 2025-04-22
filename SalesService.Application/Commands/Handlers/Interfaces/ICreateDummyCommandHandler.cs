using SalesService.Domain.Entities.DummyEntitie;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Application.Commands.Handlers.Interfaces
{
    public interface ICreateDummyCommandHandler
    {
        Task<Dummy> Handle(CreateDummyCommand command);

    }
}
