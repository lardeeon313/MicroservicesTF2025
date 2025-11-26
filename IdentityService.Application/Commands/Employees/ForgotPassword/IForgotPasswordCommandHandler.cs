using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ForgotPassword
{
    public interface IForgotPasswordCommandHandler
    {
        Task<ForgotPasswordResponse> HandleAsync(ForgotPasswordCommand command);
    }
}
