using IdentityService.Application.Commands.Register;
using IdentityService.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Interfaces
{
    public interface IRegisterCommandHandler
    {
        Task<CommandResult> Handle(RegisterCommand command);
    }
}
