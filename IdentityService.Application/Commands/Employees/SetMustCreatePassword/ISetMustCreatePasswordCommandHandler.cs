using IdentityService.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.SetMustCreatePassword
{
    public interface ISetMustCreatePasswordCommandHandler
    {
        Task<CommandResult> Handle(SetMustCreatePasswordCommand command);
    }
}
