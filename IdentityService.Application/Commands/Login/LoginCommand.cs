using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Login
{
    public class LoginCommand
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
