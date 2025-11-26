using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.SetMustCreatePassword
{
    public class SetMustCreatePasswordCommand
    {
        public string UserIdentityId { get; set; } = null!;

        public SetMustCreatePasswordCommand(string userIdentityId)
        {
            UserIdentityId = userIdentityId;
        }
    }
}
