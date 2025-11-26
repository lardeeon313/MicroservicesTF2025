using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.CreateNewPassword
{
    public class CreateNewPasswordCommand
    {
        public string UserIdentityId { get; set; } = null!;
        public string NewPassword { get; set; } = null!;

        public CreateNewPasswordCommand(string userIdentityId, string newPassword)
        {
            UserIdentityId = userIdentityId;
            NewPassword = newPassword;
        }
    }
}
