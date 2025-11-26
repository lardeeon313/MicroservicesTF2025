using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ForgotPassword
{
    public class ForgotPasswordCommand
    {
        public string Email { get; }

        public ForgotPasswordCommand(string email)
        {
            Email = email;
        }
    }
}
