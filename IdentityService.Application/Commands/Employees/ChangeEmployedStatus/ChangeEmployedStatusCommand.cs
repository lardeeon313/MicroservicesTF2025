using IdentityService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Commands.Employees.ChangeEmployedStatus
{
    public class ChangeEmployedStatusCommand
    {
        public string UserIdentityId { get; set; } = null!;
        public EmployedStatus NewStatus { get; set; }

        public ChangeEmployedStatusCommand(string userIdentityId, EmployedStatus newStatus)
        {
            UserIdentityId = userIdentityId;
            NewStatus = newStatus;
        }
    }
}
