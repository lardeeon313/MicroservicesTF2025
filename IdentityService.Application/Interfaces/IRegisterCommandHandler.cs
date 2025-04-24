using IdentityService.Application.Commands.Register;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Interfaces
{
    public interface IRegisterCommandHandler
    {
        Task<string> Handle(RegisterCommand command);
    }
}
