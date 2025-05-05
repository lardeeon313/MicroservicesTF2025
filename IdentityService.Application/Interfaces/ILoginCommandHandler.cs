using IdentityService.Application.Commands.Login;
using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Interfaces
{
    public interface ILoginCommandHandler
    {
        Task<AuthResponse?> Handle(LoginCommand command);
    }
}
