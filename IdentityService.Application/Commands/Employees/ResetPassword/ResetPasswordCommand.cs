using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ResetPassword
{
    public class ResetPasswordCommand
    {
        public ResetPasswordCommand(string email, string token, string newPassword)
        {
            Email = email;
            Token = token;
            NewPassword = newPassword;
        }

        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
